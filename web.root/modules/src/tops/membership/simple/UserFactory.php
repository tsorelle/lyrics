<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/6/2019
 * Time: 11:12 AM
 */

namespace Tops\membership\simple;


use Tops\sys\IUser;
use Tops\sys\IUserAccountManager;
use Tops\sys\IUserFactory;

class UserFactory implements IUserFactory
{
    /**
     * @return IUser
     */
    public function createUser()
    {
        return new User();
    }

    /**
     * @return IUserAccountManager
     */
    public function createAccountManager()
    {
        return new AccountManager();
    }
}