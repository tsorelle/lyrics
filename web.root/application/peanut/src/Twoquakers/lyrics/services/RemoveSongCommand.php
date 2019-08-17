<?php


namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\SongManager;

class RemoveSongCommand extends TServiceCommand
{

    protected function run()
    {
        $songId = $this->getRequest();
        if (!$songId) {
            $this->addErrorMessage('No song id received');
            return;
        }
        $manager = new SongManager();
        $manager->removeSong($songId);
    }
}