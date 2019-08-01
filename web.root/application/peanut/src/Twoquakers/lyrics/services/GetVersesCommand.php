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
        $file = @$request->Value;
        if (!$file) {
            $this->addErrorMessage("No song request.");
            return;
        }
        $verses = $manager->getVerses($file);
        if ($verses === null) {
            $this->addErrorMessage("No song file, $file, found.");
            return;
        }
        $response = new \stdClass();
        $response->verses = $verses;
        $response->title = $request->Name;
        $this->setReturnValue($response);
    }
}