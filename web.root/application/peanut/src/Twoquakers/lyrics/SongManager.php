<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/30/2019
 * Time: 4:19 PM
 */

namespace TwoQuakers\lyrics;


use Tops\sys\TNameValuePair;
use Tops\sys\TPath;

class SongManager
{
    /**
     * @return TNameValuePair[]
     */
    public function getSetList()
    {
        $result = $this->dirToNameValueList('data/sets');
        $all = TNameValuePair::Create('All','all');
        array_unshift($result,$all);
        return $result;
    }

    /**
     * @param $setName
     * @return TNameValuePair[];
     */
    public function getSet($setName) {
        if ($setName === 'all') {
            return $this->dirToNameValueList('data/songs');
        }
        $path = TPath::fromFileRoot('data/sets/'.$setName);
        $names = @file($path);
        if ($names === false) {
            return null;
        }
        return $this->fileNamesToNameValueList($names);
    }

    /**
     * @return TNameValuePair[]
     */
    public function getAllSongs()
    {
        return $this->dirToNameValueList('data/songs');
    }

    /**
     * @return \stdClass[]
     */
    public function getVerses($filename)
    {
        $path = TPath::fromFileRoot('data/songs/'.$filename);
        $text = @file($path);
        if ($text === false) {
            return null;
        }
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

    const lcwords = ['the','of','and','a','on','in'];
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
        return count($this->getAllSongs());
    }
}