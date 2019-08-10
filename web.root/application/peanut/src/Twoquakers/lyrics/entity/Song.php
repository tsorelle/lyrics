<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/8/2019
 * Time: 11:23 AM
 */

namespace TwoQuakers\lyrics\entity;


class Song
{
    /**
     * @var int
     */
    public $id;
    /**
     * @var string
     */
    public $title;
    /**
     * @var string
     */
    public $user;
    /**
     * @var string
     */
    public $lyrics;

    /**
     * @var int
     */
    public $public;

}