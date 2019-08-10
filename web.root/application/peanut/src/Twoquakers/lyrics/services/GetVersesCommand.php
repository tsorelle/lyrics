<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/30/2019
 * Time: 3:50 PM
 */
namespace TwoQuakers\lyrics\services;

use TwoQuakers\lyrics\SongManager;

class GetVersesCommand extends \Tops\services\TServiceCommand
{

    protected function run()
    {
        $manager = new SongManager();
        $request = $this->getRequest();
        if (!$request) {
            $this->addErrorMessage("No request received");
        }

        $songId = @$request->id;
        if (!$songId) {
            $this->addErrorMessage("No song request.");
            return;
        }
        $verses = $manager->getVerses($songId);
        if ($verses === null) {
            $this->addErrorMessage("No song, $request->title, found.");
            return;
        }
        $response = new \stdClass();
        $response->verses = $verses;
        $this->setReturnValue($response);
    }
}