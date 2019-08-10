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
    public function getSong($id) {
        $sql = self::lyricFields . ' WHERE s.id = ?';
        $stmt = $this->makeStatement($sql,[$id],self::songClassName);
        return $stmt->fetch();
    }


    public function getSongList($setId = 0,$authorized = true) {
        $params = [$setId];
        $sql = self::songListQuery;
        $where = '';

        if (is_numeric($setId)) {
            if ($setId > 0) {
                $sql .= ' JOIN lyrics_setsongs ss ON ss.songId = s.id ';
                $where = 'ss.setId = ? ';
            }
            else {
                $params = [];
            }
            if (!$authorized) {
                if ($where) {
                    $where .= ' AND ';
                }
                $where .= ' public = 1';
            }
        }
        else {
            // setId is username
            $where = 's.user = ?';
        }

        if ($where) {
            $sql .= " WHERE $where ";
        }

        $sql.= " ORDER BY s.title";
        $query = new TQuery();
        $stmt = $query->executeStatement($sql,$params);
        return $stmt->fetchAll(\PDO::FETCH_OBJ);
    }

    public function getUserSongs($username) {
        $sql = self::lyricFields . 'WHERE s.user = ?';
        $stmt = $this->makeStatement($sql,[$username],self::songClassName);
        return $stmt->fetchAll();
    }

    public function getSongSets($username) {
        $query = new TQuery();
        $baseSql = 'SELECT id, setname, user FROM lyrics_sets WHERE user = ?';
        $sql = "$baseSql AND setname='default'";
        $stmt = $this->makeStatement($sql,[$username],self::setClassName);
        $default =  $stmt->fetch();
        $sql = "$baseSql AND setname<>'default'";
        $stmt = $this->makeStatement($sql." AND setname<>'default' ORDER BY setname",[$username],self::setClassName);
        $result =  $stmt->fetchAll();
        if ($default) {
            array_unshift($result,$default);
        }
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
        $stmt = $query->executeStatement($sql,[$setId]);
        $sql = 'DELETE FROM lyrics_sets WHERE id = ?';
        $stmt = $query->executeStatement($sql,[$setId]);
    }

    public function removeSong($songId) {
        $query = new TQuery();
        $sql = 'DELETE FROM lyrics_setsongs WHERE songId = ?';
        $stmt = $query->executeStatement($sql,[$songId]);
        $sql = 'DELETE FROM lyrics_songs WHERE id = ?';
        $stmt = $query->executeStatement($sql,[$songId]);
    }

    public function updateSongSet($setId,$songIds) {
        $query = new TQuery();
        $sql = 'DELETE FROM lyrics_setsongs WHERE setId = ?';
        $stmt = $query->executeStatement($sql,[$setId]);

        foreach ($songIds as $songId) {
            $sql = 'INSERT INTO lyrics_setsongs (songId,setId) VALUE (?,?)';
            $stmt = $query->executeStatement($sql,[$songId,$setId]);
        }
    }

    public function getSongCount(bool $authorized)
    {
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

    public function addSongToSet($songId, $setId)
    {
        $query = new TQuery();
        $sql = 'INSERT INTO lyrics_setsongs (songId,setId) VALUES (?,?)';
        $stmt = $query->executeStatement($sql,[$songId,$setId]);
    }

}