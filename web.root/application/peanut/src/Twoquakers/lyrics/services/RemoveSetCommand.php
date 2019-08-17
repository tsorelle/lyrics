<?php


namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\SongManager;

class RemoveSetCommand extends TServiceCommand
{


    protected function run()
    {
       $setId = $this->getRequest();
       if (!$setId) {
           $this->addErrorMessage('No set id received.');
           return;
       }
       $manager = new SongManager();
       $manager->removeSet($setId);
    }
}