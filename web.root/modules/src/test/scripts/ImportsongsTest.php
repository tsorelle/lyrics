<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/9/2019
 * Time: 9:58 AM
 */

namespace PeanutTest\scripts;


use Tops\sys\TPath;
use TwoQuakers\lyrics\db\LyricsRepository;

class ImportsongsTest extends TestScript
{

    /**
     * @var LyricsRepository
     */
    private $repository;
    private $songpath;

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


    public function execute()
    {
        exit ("Onetime script\n");
        $this->repository = new LyricsRepository();
        $this->songpath = TPath::fromFileRoot('/data/sets');
        $sets = ['default.txt','blues-1.txt'];
        $startIndex = 0;
        // $startIndex = 56;
        $endIndex = count($sets);
        for($i = $startIndex; $i < $endIndex; $i++) {
            $this->import( $i,$sets[$i]);
        }
        // print_r($songfiles);

    }

    private function import($setId, string $setFile)
    {
        print "Importing $setFile\n";
        $songs = file($this->songpath.'/'.$setFile);
        foreach($songs as $songname) {
            $title = $this->toTitle($songname);
            $song = $this->repository->getSongByTitle($title);
            if ($song) {
                print "Adding $song->title to set $setFile\n";
                $this->repository->addSongToSet($song->id,$setId);
            }
            else {
                print "Song not found: $title\n";
            }
        }
    }
}