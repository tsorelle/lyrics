<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/31/2019
 * Time: 7:33 AM
 */

use TwoQuakers\lyrics\SongManager;
use PHPUnit\Framework\TestCase;

class SongManagerTest extends TestCase
{

    public function testGetAllSongs()
    {
        $manager = new \TwoQuakers\lyrics\SongManager();
        $list = $manager->getAllSongs();
        $this->assertNotEmpty($list);

    }

    public function testGetSetList()
    {
        $manager = new \TwoQuakers\lyrics\SongManager();
        $list = $manager->getSetList();
        $this->assertNotEmpty($list);
    }


    public function testGetVerses()
    {
        $manager = new \TwoQuakers\lyrics\SongManager();
        $actual = $manager->getVerses('gum-tree-canoe.txt');
        $this->assertNotEmpty($actual);;
        $actual = $manager->getVerses('no-file.txt');
        $this->assertNull($actual);

    }

    public function testGetSet()
    {
        $manager = new \TwoQuakers\lyrics\SongManager();
        $set = $manager->getSet('blues-1.txt');
        $this->assertNotEmpty($set);
        $set = $manager->getSet('no-file.txt');
        $this->assertNull($set);

    }

    public function testToTitle()
    {
        $manager = new \TwoQuakers\lyrics\SongManager();
        $name = 'in-the-county-seat-of-wise-jail.txt';
        $expected = 'In the County Seat of Wise Jail';
        $actual = $manager->toTitle($name);
        $this->assertEquals($expected,$actual);

    }
}
