<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/12/2017
 * Time: 10:01 AM
 */

namespace PeanutTest\scripts;


use Tops\sys\TWebSite;

class SmoketestTest extends TestScript
{

    public function execute()
    {
        if ($this->argCount) {
            print_r($this->args);
        }

        $this->assert(true,'Testing works');
    }
}