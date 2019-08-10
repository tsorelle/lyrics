<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/6/2019
 * Time: 8:30 AM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use Tops\sys\TUser;

class UploadLyricsCommand extends TServiceCommand
{

    protected function run()
    {
        $user = TUser::getCurrent();
        if (!$user->isAuthenticated()) {
            $this->addErrorMessage('Not authenticated');
        }
    }
}