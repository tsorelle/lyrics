<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/8/2019
 * Time: 11:22 AM
 */

namespace TwoQuakers\lyrics\db;


use Tops\db\TQuery;
use TwoQuakers\lyrics\entity\Song;
use TwoQuakers\lyrics\entity\SongSet;

class LyricsRepository
{
    const lyricFields = 'SELECT  s.id, s.title,s.public,  s.user, s.lyrics FROM lyrics_songs s  ';
    // const songListQuery = "SELECT  s.id, IF(s.user IS NULL OR s.user = '',s.title,CONCAT(s.`title`,'(',s.`user`,')')) AS 'title', s.user FROM lyrics_songs s  ";
    const songListQuery = "SELECT  s.id, s.title, s.user FROM lyrics_songs s  ";

    const songClassName = 'TwoQuakers\lyrics\entity\Song';
    const setClassName = 'TwoQuakers\lyrics\entity\SongSet';

    private function makeStatement($sql,$params,$classname) {
        $query = new TQuery();
        $stmt = $query->executeStatement($sql,$params);
        /** @noinspection PhpMethodParametersCountMismatchInspection */
        $stmt->setFetchMode(\PDO::FETCH_CLASS, $classname);
        return $stmt;
    }

    /**
     * @param $id
     * @return Song
     */
    public function getSong($songId) {
        $sql = 'SELECT id, title, public, `user`, lyrics FROM lyrics_songs WHERE id = ?';
        $query = new TQuery();
        $stmt= $query->executeStatement($sql,[$songId]);
        return $stmt->fetch(\PDO::FETCH_OBJ);
    }


    public function getSongList($setId = 0,$authorized = true) {

        $params = [$setId];
        $sql = self::songListQuery;
        $where = '';

        $orderBy = ' ORDER BY s.title';
        if (is_numeric($setId)) {
            if ($setId > 0) {
                $sql .= ' JOIN lyrics_setsongs ss ON ss.songId = s.id ';
                $where = 'ss.setId = ? ';
                $orderBy = ' ORDER BY ss.sequence';
            }
            else {
                $params = [];
            }
            /*
            if (!$authorized) {
                if ($where) {
                    $where .= ' AND ';
                }
                $where .= ' public = 1';
            }
            */
        }
/*        else {
            // virtual set by username
            $where = 's.user = ?';
        }*/

        if ($where) {
            $sql .= " WHERE $where ";
        }

        $sql.= $orderBy;
        $query = new TQuery();
        $stmt = $query->executeStatement($sql,$params);
        return $stmt->fetchAll(\PDO::FETCH_OBJ);
    }

    public function getUserSongs($username) {
        $sql = self::lyricFields . 'WHERE s.user = ?';
        $stmt = $this->makeStatement($sql,[$username],self::songClassName);
        return $stmt->fetchAll();
    }


    public function getSongSet($setId) {
        $query = new TQuery();
        $sql = 'SELECT id, setname, user FROM lyrics_sets WHERE id = ?';

    }

    public function getSongSets($username) {
        $query = new TQuery();
        $baseSql = 'SELECT id, setname, user FROM lyrics_sets WHERE user = ?';
/*        $sql = "$baseSql AND setname='default'";
        $stmt = $this->makeStatement($sql,[$username],self::setClassName);
        $default =  $stmt->fetch();*/

        $sql = "$baseSql AND setname <>'default'";
        $stmt = $this->makeStatement($sql." AND setname<>'default' ORDER BY setname",[$username],self::setClassName);
        $result =  $stmt->fetchAll();
/*        if ($default) {
            array_unshift($result,$default);
        }*/
        return $result;
    }


    public function getDefaultSet($username='') {
        $sql = 'SELECT id, setname, user FROM lyrics_sets WHERE user = ?';
        $stmt = $this->makeStatement($sql,[$username],self::setClassName);
        return $stmt->fetchAll();
    }



    public function createSet($setname, $user) {
        $sql = 'INSERT INTO lyrics_sets (setname,user) values (?,?)';
        $query = new TQuery();
        $stmt = $query->executeStatement($sql,[$setname, $user]);
    }

    public function createSong($title,$lyrics, $user='',$public=1) {
        $sql = 'INSERT INTO lyrics_songs (title,lyrics,public,user) values (?,?,?,?)';
        $query = new TQuery();
        $stmt = $query->executeStatement($sql,[$title,$lyrics,$public, $user]);
    }

    public function removeSet($setId) {
        $query = new TQuery();
        $sql = 'DELETE FROM lyrics_setsongs WHERE setId = ?';
        $query->execute($sql,[$setId]);
        $sql = 'DELETE FROM lyrics_sets WHERE id = ?';
        return $query->execute($sql,[$setId]);
    }

    public function removeSong($songId) {
        $query = new TQuery();
        $sql = 'DELETE FROM lyrics_setsongs WHERE songId = ?';
        $query->execute($sql,[$songId]);
        $sql = 'DELETE FROM lyrics_songs WHERE id = ?';
        return $query->execute($sql,[$songId]);
    }

    /**
     * @param $setId
     * @param $songs
     * @throws \Exception
     */
    public function updateSetSongs($setId,$songs) {
        $query = new TQuery();
        $sql = 'DELETE FROM lyrics_setsongs WHERE setId = ?';
        $query->execute($sql,[$setId]);

        foreach ($songs as $song) {
            if (empty($song->songId)) {
                throw new \Exception('No song id in list');
            }
            $sequence = @$song->sequence ?? 0;
            $sql = 'INSERT INTO lyrics_setsongs (songId,setId,sequence) VALUES (?,?,?)';
            $stmt = $query->executeStatement($sql,[$song->songId,$setId,$sequence]);
        }
    }

    public function getSongCount(bool $authorized)
    {
        $authorized = true;
        $sql = 'SELECT COUNT(*) FROM lyrics_songs ';
        if (!$authorized) {
          $sql .= 'WHERE public = 1';
        }
        $query = new TQuery();
        return $query->getValue($sql);
    }

    public function getSongByTitle(string $title) // , string $user = '')
    {
        $sql = self::lyricFields . ' WHERE s.title = ?';
        $stmt = $this->makeStatement($sql,[$title],self::songClassName);
        return $stmt->fetch();
    }

    public function addSongToSet($songId, $setId,$sequence)
    {
        $query = new TQuery();
        $sql = 'INSERT INTO lyrics_setsongs (songId,setId,sequence) VALUES (?,?,?)';
        return $query->execute($sql,[$songId,$setId,$sequence]);
    }

    public function appendSong($setId, $songId) {
        $sql = 'SELECT MAX(sequence) FROM lyrics_setsongs WHERE setId = ?';
        $query = new TQuery();
        $sequence = $query->getValue($sql,[$setId]);
        $sequence = $sequence === false || $sequence === null ? 0 : $sequence;
        $this->addSongToSet($songId, $setId, $sequence + 1);
    }

    public function countUniqueSetNames($setName, $user, int $setId)
    {
        $query = new TQuery();
        $sql = 'SELECT COUNT(*) FROM `lyrics_sets` WHERE setname = ? AND user = ? AND id <> ?';
        $stmt = $query->executeStatement($sql,[$setName,$user,$setId]);
        return $stmt->fetchColumn();
    }

    public function newSongSet($setName, string $username)
    {
        $query = new TQuery();
        $sql = 'insert into lyrics_sets (setname, `user`) values  (?,?)';
        return $query->insert($sql,[$setName,$username]);
    }

    public function changeSetName($setId,$setname) {
        $query = new TQuery();
        $sql = 'UPDATE lyrics_sets SET setname = ?  WHERE id = ?;';
        $query->execute($sql,[$setname, $setId]);
    }

    public function insertSong($title, $public, $user, $lyrics)
    {
        $sql = 'INSERT INTO lyrics_songs (title, public, user, lyrics) VALUES (?,?,?,?)';
        $query = new TQuery();
        return $query->insert($sql,[$title,$public,$user,$lyrics]);
    }

    public function updateSong($id, $title, $public, $user, $lyrics)
    {
        $sql = 'UPDATE lyrics_songs SET title = ?, public = ?, user = ?, lyrics = ? where id = ?';
        $query = new TQuery();
        return $query->execute($sql,[$title,$public,$user,$lyrics,$id]);
    }
}