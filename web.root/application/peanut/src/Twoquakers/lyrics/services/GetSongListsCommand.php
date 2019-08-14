<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/13/2019
 * Time: 6:30 AM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\SongManager;

class GetSongListsCommand extends TServiceCommand
{

    protected function run()
    {
        $setId = $this->getRequest();
        $response = new \stdClass();
        $manager = new SongManager();
        $response->setSongs =  $setId ? $manager->getSongsInSet($setId) : [];
        $response->availableSongs = $manager->getAllSongs();
        $this->setReturnValue($response);
    }
}