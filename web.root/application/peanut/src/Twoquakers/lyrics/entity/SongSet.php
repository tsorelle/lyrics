<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/8/2019
 * Time: 11:25 AM
 */

namespace TwoQuakers\lyrics\entity;


class SongSet
{
    const AllSongs = 0;
    const MySongs = -1;

    /**
     * @var int
     */
    public $id;
    /**
     * @var string
     */
    public $setname;
    /**
     * @var string
     */
    public $user;

    public static function GetAllSet() {
        $set = new SongSet();
        $set->id = 0;
        $set->setname = 'All';
        $set->user = '';
        return $set;
    }

    public static function GetMySongsSet() {
        $set = new SongSet();
        $set->id = -1;
        $set->setname = 'My Songs';
        $set->user = '';
        return $set;
    }

    public static function GetDefaultSet() {
        $set = new SongSet();
        $set->id = 1;
        $set->setname = 'Default';
        $set->user = '';
        return $set;
    }


    public static function CreateSongSet($request)
    {
        $set = new SongSet();
        $set->id = -1;
        $set->setname = '';
        $set->user = '';
        return $set;
    }

}