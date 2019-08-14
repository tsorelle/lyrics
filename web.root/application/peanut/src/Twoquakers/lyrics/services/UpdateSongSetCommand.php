<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/13/2019
 * Time: 4:56 PM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\SongManager;

class UpdateSongSetCommand extends TServiceCommand
{
    protected function run()
    {
        $request = $this->getRequest();
        if (!$request) {
            $this->addErrorMessage('No request received');
        }

        $setId = @$request->setId;
        $isNew = (!$setId);
        $setName = @$request->setName;
        if ($isNew) {
            if (!$setName) {
                $this->addErrorMessage('Set name is required');
                return;
            }
        }
        $username = @$request->user;
        if (!$username) {
            $username = $this->getUser()->getUserName();
        }
        $manager = new SongManager();
        if (!$manager->checkUniqueSetName($setName, $username, $setId)) {
            $this->addErrorMessage('Set name is in use. Try another');
            return;
        }

        if ($isNew) {
            $setId = $manager->createSet($setName,$username);
        }
        else {
            $manager->changeSetName($setId,$setName);
        }
        $manager->updateSetSongs($setId, $request->songs);
        $response = new \stdClass();
        $response->setId = $setId;
        $response->songs = $manager->getSongsInSet($setId);

        $this->setReturnValue($response);
    }
}