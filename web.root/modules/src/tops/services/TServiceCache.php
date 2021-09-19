<?php


namespace Tops\services;


use Tops\cache\TCachedItem;

class TServiceCache extends \Tops\cache\TAbstractCache
{

    /**
     * @inheritDoc
     */
    function GetCachedItem($keys)
    {
        // TODO: Implement GetCachedItem() method.
    }

    /**
     * @inheritDoc
     */
    function SetCachedItem($keys, TCachedItem $item)
    {
        // TODO: Implement SetCachedItem() method.
    }

    function FlushCachedItems($category = null)
    {
        // TODO: Implement FlushCachedItems() method.
    }

    function DeleteCachedItem($keys)
    {
        // TODO: Implement DeleteCachedItem() method.
    }
}