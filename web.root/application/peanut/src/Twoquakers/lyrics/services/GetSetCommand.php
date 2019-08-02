<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/31/2019
 * Time: 9:35 AM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\SongManager;

class GetSetCommand extends TServiceCommand
{

    protected function run()
    {
        $setFilename = $this->getRequest();
        if (empty($setFilename)) {
            $this->addErrorMessage("No set file name");
            return;
        }

        $response = new \stdClass();
        $manager = new SongManager();

        $response->songs = $manager->getSet($setFilename);
        if (empty($response->songs)) {
            $this->addErrorMessage("No songs found in set '$response->set'");
            return;
        }

        $firstSong = $response->songs[0];
        $response->title = $firstSong->Name;
        $response->verses = $manager->getVerses($firstSong->Value);
        $this->setReturnValue($response);
    }
}