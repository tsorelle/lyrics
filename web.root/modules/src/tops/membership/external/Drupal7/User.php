<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/6/2019
 * Time: 8:51 AM
 */

namespace Tops\membership\external\Drupal7;


use Tops\sys\TAbstractUser;
use Tops\sys\TPath;
use Tops\membership\db\UserTable;
use Tops\sys\TUser;

class User extends TAbstractUser
{
    const UserSessionId = 'tops_application_user';

    private $userData;
    /**
     * @var UserTable
     */
    private $userTable;

    /**
     * @return UserTable
     */
    private function getUserTable() {
        if (!isset($this->userTable)) {
            $this->userTable = new UserTable('uid','pass','mail');
        }
        return $this->userTable;
    }
    /**
     * @param $id
     * @return mixed
     */
    public function loadById($id)
    {
        $this->userData = $this->getUserTable()->selectUserById($id);
    }

    /**
     * @param $email
     * @return mixed
     */
    public function loadByEmail($email)
    {
        $this->userData = $this->getUserTable()->selectUserByEmail($email);
    }

    /**
     * @param $userName
     * @return mixed
     */
    public function loadByUserName($userName)
    {
        $this->userData = $this->getUserTable()->selectUserByUserName($userName);
    }

    /**
     * @return mixed
     */
    public function loadCurrentUser()
    {
        $this->userData = @$_SESSION[User::UserSessionId];
    }

    /**
     * @return bool
     */
    public function isAdmin()
    {
        if ($this->isAuthenticated()) {
            if ($this->userData->id === 1) {
                return true;
            }
            return $this->isInRole('administrator');
        }
        return false;
    }

    private $roles;
    /**
     * @return string[]
     */
    public function getRoles()
    {
        if (!isset($this->roles)) {
            if (!$this->userData) {
                return ['guest'];
            }
            $uid = $this->userData->id;
            $usertable = $this->getUserTable();
            $this->roles = $usertable->getRoles($uid);
        }
        return $this->roles;
    }

    private function authenticate($stored_hash,$password) {
        $drupalInc = TPath::fromFileRoot('modules/drupal/password.inc');
        require_once $drupalInc;

        $type = substr($stored_hash, 0, 3);
        switch ($type) {
            case '$S$':
                // A normal Drupal 7 password using sha512.
                $hash = _password_crypt('sha512', $password, $stored_hash);
                break;
            case '$H$':
                // phpBB3 uses "$H$" for the same thing as "$P$".
            case '$P$':
                // A phpass password generated using md5.  This is an
                // imported password or from an earlier Drupal version.
                $hash = _password_crypt('md5', $password, $stored_hash);
                break;
            default:
                return FALSE;
        }

        return ($hash && $stored_hash == $hash);

    }

    public function signIn($username, $password = null)
    {
        $userData = $this->getUserTable()->selectUserByUserName($username);
        if ($userData) {
            $authenticated = $this->authenticate($userData->password,$password);
        }
        else {
            $authenticated = false;
        }
        $this->userData = $authenticated ? $userData : null;
        $_SESSION[User::UserSessionId] = $this->userData;
        $test = $this->isMemberOf('administrator');
        return $authenticated;
    }

    public function isInRole($roleName) {
        $roles = $this->getRoles();
        return in_array($roleName, $roles);

    }
    public function isMemberOf($roleName)
    {
        if (!$this->isAuthenticated()) {
            return $roleName === 'guest';
        }
        if (parent::isMemberOf($roleName)) {
            return true;
        };
        return $this->isInRole($roleName);
    }

    /**
     * @return bool
     */
    public function isAuthenticated()
    {
        if (!empty($this->userData)) {
            $sessionUser = @$_SESSION[User::UserSessionId];
            if ($sessionUser) {
                return $sessionUser->name == $this->userData->name;
            }
        }
        return false;
    }

    protected function loadProfile()
    {
        $this->profile[TUser::profileKeyEmail] = @$this->userData->email;
    }
}