<template>
  <div id="wrapper">
    <Row>
      <Col span="24">
      <Tabs v-model="selectedTab"
            type="card"
            @on-click="saveActiveBoard"
            @dblclick.native="handleDblClick"
      >

        <Tab-pane v-for="board in boards"
                  :label="boardTabLabel(board.label, board.id)"
                  :name="board.id"
                  :key="board.id"
        >
          <board :boardId="board.id"
                 :selectedTab="selectedTab"
                 :showDone="board.showDone"
                 :prependNewItem="board.prependNewItem"
                 :showDate="settings.itemCreationDate"
                 :setAlarm="board.setAlarm"
                 @showDoneSwitched="showDoneSwitched"
                 @prependNewItemChange="prependNewItemChange"
          >
          </board>
        </Tab-pane>
        <div slot="extra">
          <Tooltip content="Copy password" placement="bottom-end" :transfer="true" :delay="500">
            <Button type="dashed"
                    @click="copyToClipboard"
                    size="small"
                    icon="ios-copy"
                    shape="circle"
                    style="margin-right: 5px;">
            </Button>
          </Tooltip>
          <Tooltip content="Add new board" placement="bottom-end" :transfer="true" :delay="500">
            <Button type="dashed"
                    @click="showNewBoardModal"
                    size="small"
                    icon="plus"
                    shape="circle"
                    style="margin-right: 5px;">
            </Button>
          </Tooltip>
          <Tooltip content="Settings" placement="bottom-end" :transfer="true" :delay="500">
            <Button type="dashed"
                    @click="showSettingsModal"
                    size="small"
                    icon="gear-a"
                    shape="circle"
                    style="margin-right: 5px;">
            </Button>
          </Tooltip>
        </div>
      </Tabs>
      </Col>
    </Row>
    <footer @click="open('https://github.com/czytelny')">
      Crafted with
      <Icon type="ios-heart"></Icon>
      by Michal Chwedczuk
    </footer>

    <new-board-modal :newBoardModal="newBoardModal"
                     @submitNewBoard="submitNewBoard"
                     @closeNewBoardModal="closeNewBoardModal">
    </new-board-modal>
    <settings-modal :isVisible="settingsModal"
                    :boards="boards"
                    :itemCreationDate="settings.itemCreationDate"
                    :savedPassword="settings.savedPassword"
                    @closeSettingsModal="closeSettingsModal"
                    @saveBoards="saveBoards"
                    @forceReload="forceReload"
                    @saveSettings="saveSettings"
    >
    </settings-modal>
  </div>
</template>

<script src="./LoadingPage.js"></script>

<style>
  .ivu-tabs-tab-active .close-icon {
    opacity: 1;
  }

  .ivu-tabs-tab:hover .close-icon {
    display: inline-block;
    opacity: 1;
  }

  .close-icon {
    opacity: 0;
    transition: opacity .3s;
    position: absolute;
    padding-left: 3px;
  }

  footer {
    position: fixed;
    bottom: 0;
    background-color: #5a6376;
    color: white;
    text-align: center;
    width: 100%;
    cursor: pointer;
    opacity: .4;
  }

  .ivu-tabs-bar {
    user-select: none;
  }
</style>
