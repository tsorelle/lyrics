<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 11/14/2017
 * Time: 6:18 AM
 */

namespace Tops\db;


class LookupTableEntity extends TimeStampedEntity
{
    public $id;
    public $code;
    public $name;
    public $description;

}