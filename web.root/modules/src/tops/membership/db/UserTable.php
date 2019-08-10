<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/6/2019
 * Time: 9:56 AM
 */

namespace Tops\membership\db;


use PDO;
use Tops\db\TQuery;

class UserTable
{

    const UserClassName = 'Tops\membership\db\UserRecord';

    private $tableName;
    private $passwordColumn;
    private $nameColumn;
    private $emailColumn;
    private $idColumn;
    private $databaseId;

    public function __construct($idColumn='id', $passwordColumn='password', $emailColumn='email', $nameColumn='name', $tableName = 'users', $databaseId='membership')
    {
        $this->tableName =      $tableName;
        $this->passwordColumn = $passwordColumn;
        $this->nameColumn =     $nameColumn;
        $this->emailColumn =    $emailColumn;
        $this->idColumn = $idColumn;
        $this->databaseId = $databaseId;
    }

    /**
     * @param $selectColumn
     * @param $value
     * @return UserRecord
     */
    public function selectUser($selectColumn,$value) {
        $sql = sprintf("SELECT `%s` AS 'id', `%s` AS 'name', `%s` AS 'email', `%s` AS 'password' FROM %s WHERE %s=?",
            $this->idColumn,
            $this->nameColumn,
            $this->emailColumn,
            $this->passwordColumn,
            $this->tableName,
            $selectColumn);
        $query = new TQuery($this->databaseId);
        $stmt = $query->executeStatement($sql, [$value]);
        /** @noinspection PhpMethodParametersCountMismatchInspection */
        $stmt->setFetchMode(PDO::FETCH_CLASS, UserTable::UserClassName);
        return $stmt->fetch();
    }

    public function selectUserById($id) {
        return $this->selectUser($this->idColumn,$id);
    }

    public function selectUserByEmail($email) {
        return $this->selectUser($this->emailColumn,$email);
    }

    public function selectUserByUserName($username) {
        return $this->selectUser($this->nameColumn,$username);
    }

    public function getRoles($uid)
    {
        $sql = 'SELECT r.`name` FROM role r JOIN users_roles ur ON  ur.rid = r.`rid` WHERE ur.uid = ?';
        $query = new TQuery($this->databaseId);
        $stmt = $query->executeStatement($sql, [$uid]);
        /** @noinspection PhpMethodParametersCountMismatchInspection */
        // $stmt->setFetchMode(\PDO::FETCH_COLUMN);
        return $stmt->fetchAll(\PDO::FETCH_COLUMN,0);
    }
}