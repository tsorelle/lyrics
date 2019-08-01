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
        $verses = $manager->getVerses($request);
        if ($verses === null) {
            $this->addErrorMessage("No song file, $request, found.");
            return;
        }
        $response = new \stdClass();
        $response->verses = $verses;
        $title = $manager->toTitle($request);
        // $this->addInfoMessage($title);
        $this->setReturnValue($response);
    }
}