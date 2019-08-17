<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/16/2019
 * Time: 6:38 AM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\SongManager;

class UpdateSongCommand extends TServiceCommand
{
    protected function run()
    {
        $request = $this->getRequest();
        if (!$request) {
            $this->addErrorMessage('Song data not received');
            return;
        }
        $songId = empty($request->id) ? 0 : $request->id;
        if (empty($request->title)) {
            $this->addErrorMessage('Song title is required');
            return;
        }
        if (empty($request->user)) {
            $this->addErrorMessage('Song user is reuired');
            return;
        }
        $lyrics = empty($request->lyrics) ? '' : $request->lyrics;
        $public = empty($request->public) ? 0 : 1;
        $setId = empty($request->setId) ? 0 : $request->setId;

        $manager = new SongManager();

        if ($songId) {
            $manager->updateSong($songId,$request->title,$public,$request->user,$lyrics);
        }
        else {
            $songId = $manager->insertSong($request->title,$public,$request->user,$lyrics,$setId);
        }
        $response = new \stdClass();
        $response->id = $songId;
        $response->songs = $manager->getSongsInSet($setId);

        $this->setReturnValue($response);
    }
}