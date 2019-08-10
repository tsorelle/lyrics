<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/6/2019
 * Time: 8:52 AM
 */

namespace Tops\membership\external\Drupal7;


use Tops\sys\IUserAccountManager;
use Tops\sys\TAddUserAccountResponse;

class AccountManager implements IUserAccountManager
{
    /**
     * @param $username
     * @return number | null
     */
    public function getCmsUserId($username)
    {
        // TODO: Implement getCmsUserId() method.
    }

    /**
     * @param $email
     * @return number | null
     */
    public function getCmsUserIdByEmail($email)
    {
        // TODO: Implement getCmsUserIdByEmail() method.
    }

    /**
     * @return TAddUserAccountResponse
     */
    public function addAccount($username, $password, $email = null, $roles = [], $profile = [])
    {
        throw new \Exception('Not supported for external systems.');
    }

    public function getPasswordResetUrl()
    {
        // TODO: Implement getPasswordResetUrl() method.
        return null;
    }

    public function getLoginUrl()
    {
        // TODO: Implement getLoginUrl() method.
        return null;
    }
}