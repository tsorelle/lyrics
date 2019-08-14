<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/30/2019
 * Time: 4:19 PM
 */

namespace TwoQuakers\lyrics;


use Tops\sys\IUser;
use Tops\sys\TNameValuePair;
use Tops\sys\TPath;
use Tops\sys\TUser;
use TwoQuakers\lyrics\db\LyricsRepository;

class SongManager
{

    private $repository;
    private function getRepository() {
        if (!isset($this->repository)) {
            $this->repository = new LyricsRepository();
        }
        return $this->repository;
    }

    /**
     * @return TNameValuePair[]
     */
    public function getUserSets(string $username)
    {
        $result = $this->getRepository()->getSongSets($username);
        return $result;
    }

    public function getDefaultSet(string $username) {

    }

    /**
     * @param $setName
     * @return TNameValuePair[];
     */
    public function getSongsInSet($setId) {
        return $this->getRepository()->getSongList($setId,$this->isAuthorized());
    }

    /**
     * @return TNameValuePair[]
     */
    public function getAllSongs()
    {
        return $this->getRepository()->getSongList();
    }

    /**
     * @return \stdClass[]
     */
    public function getVerses($id)
    {
        $song = $this->getRepository()->getSong($id);
        if ((!$song) || empty($song->lyrics)) {
            return null;
        }
        $text = explode("\n",$song->lyrics);

/*        $path = TPath::fromFileRoot('data/songs/'.$filename);
        $text = @file($path);
        if ($text === false) {
            return null;
        }*/
        $verses = [];
        $verse = new \stdClass();
        $verse->lines = [];
        foreach ($text as $line) {
            $line = trim($line);
            if ($line == '') {
                if (!empty($verse->lines)) {
                    $verses[] = $verse;
                    $verse = new \stdClass();
                    $verse->lines = [];
                }
            }
            else {
                $verse->lines[] = $line;
            }
        }
        if (!empty($verse->lines)) {
            $verses[] = $verse;
        }
        return $verses;
    }

    public function checkUniqueSetName($setName, $user, $setId)
    {
        if (!$setId) {
            $setId = 0;
        }
        $count = $this->getRepository()->countUniqueSetNames($setName, $user, $setId);
        return empty($count);
    }


    const lcwords = ['the','of','and','a','on','in'];

    public function createSet($setName, string $username)
    {
        return $this->getRepository()->newSongSet($setName,$username);
    }

    public function updateSetSongs($setId,$songIds) {
        $this->getRepository()->updateSetSongs($setId,$songIds);
    }

    public function changeSetName($setId,$setName) {
        $this->getRepository()->changeSetName($setId,$setName);
    }

    public function updateSetName($setId, $setName)
    {
        $this->getRepository()->updateSetName($setId,$setName);
    }

    public function toTitle($filename) {
        $words = explode('-',
            str_replace('.txt','',
                trim(strtolower($filename))));

        if (is_numeric($words[0])) {
            array_shift($words);
        }

        $result = [];
        $count = count($words);
        for ($i= 0; $i<$count; $i++) {
            $word = $words[$i];
            if ($i == 0 || !in_array($word,self::lcwords)) {
                $word = ucfirst($word);
            }
            $result[] = $word;
        }
        return implode(' ',$result);
    }

    /**
     * @param $dirName
     * @return TNameValuePair[]
     */
    private function dirToNameValueList($dirName) {
        $dirName = TPath::fromFileRoot($dirName);
        $names = scandir($dirName);
        return $this->fileNamesToNameValueList($names);
    }

    /**
     * @param $names
     * @return TNameValuePair[]
     */
    private function fileNamesToNameValueList($names) {
        $result = [];
        foreach ($names as $name) {
            $name = trim($name);
            if (substr($name,-4) == '.txt') {
                $result[] = TNameValuePair::Create(
                    $this->toTitle($name),
                    $name);
            }
        }
        return $result;

    }

    public function getSongCount()
    {
        $authorized = $this->isAuthorized();
        return $this->getRepository()->getSongCount($authorized);
    }

    public function isAuthorized() {
        $user = TUser::getCurrent();
        return $user->isMemberOf('lyricist');
    }

}