<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/5/2019
 * Time: 8:23 AM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use Tops\sys\TUser;
use TwoQuakers\lyrics\SongManager;

class SignInCommand extends TServiceCommand
{

    protected function run()
    {
        $credentails = $this->getRequest();
        $response = new \stdClass();

        $user = TUser::getCurrent();
        $ok = $user->signIn($credentails->username,$credentails->password);
        if ($ok) {
            if ($user->isAdmin()) {
                $response->registered = 'admin';
            }
            else if ($user->isMemberOf('lyricist')) {
                $response->registered = 'yes';
            }
            else {
                $response->registered = 'no';
            }

            $manager = new SongManager();
            // $response->allSongs = $manager->getAllSongs();

            $response->sets = $manager->getUserSets($credentails->username);
            $response->catalogSize = $manager->getSongCount();
        }
        else {
            $response->registered = 'failed';
        }
        $this->setReturnValue($response);
    }
}