<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/16/2019
 * Time: 6:16 AM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\SongManager;

class GetSongForEditCommand extends TServiceCommand
{

    protected function run()
    {
        $songId = $this->getRequest();
        if (!$songId) {
            $this->addErrorMessage('No song id received');
            return;
        }
        $manager = new SongManager();
        $response = $manager->getSong($songId);
        if ($response == false) {
            $this->addErrorMessage("Song not found. $songId");
        }
        $this->setReturnValue($response);
    }
}