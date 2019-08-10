<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/31/2019
 * Time: 6:22 AM
 */

namespace TwoQuakers\lyrics\services;


use Tops\services\TServiceCommand;
use TwoQuakers\lyrics\entity\SongSet;
use TwoQuakers\lyrics\SongManager;

/**
 * Class GetSongsCommand
 * @package TwoQuakers\lyrics\services
 *
 * Service contract
 *
 * Response
 *    interface IGetSongsResponse extends IGetVersesResponse {
 *      set: ISongSet;
 *      sets: ISongSet[];
 *      songs: ISongInfo[];
 *      catalogSize: number;
 *      username: string;
 *      isAdmin : any;
 *    }
 */
class GetSongsCommand extends TServiceCommand
{
    protected function run()
    {
        $manager = new SongManager();
        $request = $this->getRequest();
        $response = new \stdClass();

        $user = $this->getUser();
/*        $username = $manager->isAuthorized() ? $user->getUserName() : '';
        $response->isAdmin = $user->isAdmin() ? 1 : 0;
        $response->username = $username;*/

        $mySongsSet = SongSet::GetMySongsSet();
        // $mySongsSet->id = $username;
        $allSongsSet = SongSet::GetAllSet();
        $selectedSet = $allSongsSet;
        $setList =  [$allSongsSet,$mySongsSet];

/*        $setList =  $manager->getUserSets($username);
        if (count($setList)) {
            $top = $setList[0];
            $selectedSet = (strtolower($top->setname) == 'default') ? $top : $mySongsSet;
        }
        array_unshift($setList, $mySongsSet);
        array_unshift($setList, $allSongsSet);*/

        $response->sets = $setList;
        $response->set = $selectedSet;

        $response->songs = $manager->getSongsInSet($selectedSet->id);
        if (empty($response->songs)) {
            $this->addErrorMessage("No songs found in set '$selectedSet->title'");
            return;
        }

        $song = $response->songs[0];

        $response->verses = $manager->getVerses($song->id);
        $response->catalogSize = $manager->getSongCount();
        $this->setReturnValue($response);
    }

    private function findItemById($items,$id=0) {
        if ($id) {
            foreach ($items as $item) {
                if ($id == $item->id) {
                    return $item;
                }
            }
        }
        if (empty($items)) {
            return null;
        }
        return $items[0];
    }
}