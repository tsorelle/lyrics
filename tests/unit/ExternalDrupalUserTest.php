<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/5/2019
 * Time: 7:26 AM
 */

use TwoQuakers\authentication\ExternalDrupalUser;
use PHPUnit\Framework\TestCase;

class ExternalDrupalUserTest extends TestCase
{

    public function testAuthenticate()
    {
        $user = new ExternalDrupalUser();
        $actual = $user->authenticate('Terry','De@dw00d');
        $this->assertTrue($actual);


        $actual = $user->authenticate('Terry','badpw');
        $this->assertFalse($actual);

        $actual = $user->authenticate('nobody','badpw');
        $this->assertFalse($actual);
    }
}
