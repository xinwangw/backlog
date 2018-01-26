import Board from './Board.vue'
import NewBoardModal from './NewBoardModal.vue'
import XXH from 'xxhashjs'
import SettingsModal from './SettingsModal.vue'

const storage = require('electron').remote.require('electron-settings')
const remote = require('electron').remote
const {clipboard} = require('electron')
const notifier = require('electron').remote.require('electron-notifications')

export default {
    components: {
        SettingsModal,
        NewBoardModal,
        Board
    },
    name: 'landing-page',
    data() {
        return {
            newItem: '',
            boards: [],
            selectedTab: 'default',
            newBoardModal: false,
            settingsModal: false,
            settings: {},
            boardTabLabel: (boardLabel, boardId) => (h) => {
            return h('div', [
                h('span', boardLabel),
                h('Icon', {
                    'class': {
                        'close-icon': true
                    },
                    props: {
                        type: 'ios-close-empty'
                    },
                    nativeOn: {
                        click: (event) => {
                        event.stopPropagation()
                        this.handleBoardRemove(boardLabel, boardId)
                    }
                  }
                })
              ])
            }
          }
    },
    methods: {
        handleDblClick(event) {
            if (event.target.className === 'ivu-tabs-nav-scroll') {
                this.showNewBoardModal()
            }
        },
        prependNewItemChange(value, boardId) {
            this.boards.find(board => board.id === boardId
        ).
            prependNewItem = value
            this.boards = this.boards.splice(0)
            this.saveBoards()
        },
        showDoneSwitched(value, boardId) {
            this.boards.find(board => board.id === boardId
        ).
            showDone = value
            this.boards = this.boards.splice(0)
            this.saveBoards()
        },
        open(link) {
            this.$electron.shell.openExternal(link)
        },
        closeNewBoardModal() {
            this.newBoardModal = false
        },
        showNewBoardModal() {
            this.newBoardModal = true
        },
        showSettingsModal() {
            this.settingsModal = true
        },
        closeSettingsModal() {
            this.settingsModal = false
        },
        submitNewBoard(boardName) {
            const newBoardId = XXH.h32(boardName, new Date().getTime()).toString(16)
            this.boards.push({id: newBoardId, label: boardName, showDone: false, setAlarm: boardName === 'Alarm'})
            this.saveBoards()
            this.selectedTab = newBoardId
            this.newBoardModal = false
            this.saveActiveBoard(newBoardId)
            this.$Message.success('Board added')
            this.$nextTick(() => this.$bus.$emit('boardAdded', newBoardId)
        )
        },
        fetchBoards() {
            const boards = storage.get('boards')
            if (!boards) {
                storage.set('boards', [{
                    id: 'default',
                    label: 'Default board',
                    showDone: false,
                    prependNewItem: false,
                    showDate: true
                }])
            }
            this.boards = storage.get('boards')
            console.log(storage.getAll())
        },
        handleBoardRemove(boardLabel, boardId) {
            this.$Modal.confirm({
                title: `Remove board '${boardLabel}' ?`,
                okText: 'OK, remove it',
                cancelText: 'Cancel',
                content: `<p>You are going to remove board <strong>"${boardLabel}"</strong></p>
                    <p>All items will be deleted, are you sure ?</p>`,
                onOk: () => {
                const boardIndex = this.boards.findIndex(board => board.id === boardId)
            this.boards.splice(boardIndex, 1)
            storage.set(`boards`, this.boards)
            storage.delete(`board-item-${boardId}`)
            this.saveActiveBoard(this.selectedTab)
            this.$Message.info('Board removed')
        }
        })
        },
        saveActiveBoard(boardId) {
            storage.set(`activeBoard`, boardId)
        },
        saveBoards(newBoards) {
            if (!newBoards) {
                storage.set(`boards`, this.boards)
            } else {
                storage.set(`boards`, newBoards)
            }
        },
        saveSettings(data) {
            storage.set(`settings`, data)
        },
        fetchSettings() {
            const persistedSettings = storage.get(`settings`)
            if (persistedSettings) {
                this.settings = persistedSettings
            }
        },
        forceReload() {
            remote.getCurrentWindow().reload()
            notifier.activeNotifications.forEach(n => n.close())
        },
        copyToClipboard() {
          clipboard.writeText(this.settings.savedPassword)
          this.$Message.success('Password coped to clipboard.')
        }
    },
    created() {
        this.fetchBoards()
        this.fetchSettings()
        if (storage.has('activeBoard')) {
            const activeBoardId = storage.get('activeBoard')
            this.selectedTab = activeBoardId
            this.$nextTick(() => this.$bus.$emit('appInit', activeBoardId)
        )
        }
    }
}
