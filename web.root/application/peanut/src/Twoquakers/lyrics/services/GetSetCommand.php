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
        $setId = @$this->getRequest();
        if ($setId === null) {
            $this->addErrorMessage("No set id");
            return;
        }

        if ($setId == 'all') {
            $setId = 0;
        }

        $response = new \stdClass();
        $manager = new SongManager();

        $response->songs = $manager->getSongsInSet($setId);
        if (empty($response->songs)) {
            $this->addErrorMessage("No songs found in set '$response->set'");
            return;
        }

        $firstSong = $response->songs[0];
        $response->verses = $manager->getVerses($firstSong->id);
        $this->setReturnValue($response);
    }
}