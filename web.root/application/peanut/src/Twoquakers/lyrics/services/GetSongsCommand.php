<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/31/2019
 * Time: 6:22 AM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\SongManager;

class GetSongsCommand extends TServiceCommand
{
    protected function run()
    {
        $manager = new SongManager();
        $request = $this->getRequest();


        $response = new \stdClass();
        $response->set = empty($request->set) ? '1-default.txt' : $request->set;
        $response->sets = $manager->getSetList();
        if (empty($response->sets)) {
            $this->addErrorMessage("No song sets found");
            return;
        }
        $response->songs = $manager->getSet($response->set);
        if (empty($response->songs)) {
            $this->addErrorMessage("No songs found in set '$response->set'");
            return;
        }

        if (empty($request->song)) {
           $title =  $response->songs[0]->Name;
           $filename = $response->songs[0]->Value;
        }
        else {
            $filename = $request->song;
            $title = $manager->toTitle($filename);
        }
        $response->verses = $manager->getVerses($filename);
        $response->title = $title;
        $response->catalogSize = $manager->getSongCount();
        $this->setReturnValue($response);
    }
}