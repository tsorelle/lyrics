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

class GetCatalog extends TServiceCommand
{

    protected function run()
    {
        $manager = new SongManager();
        $response = $manager->getAllSongs();
    }
}