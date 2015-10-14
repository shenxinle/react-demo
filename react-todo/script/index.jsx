(function () {

/*
*  model
*/
var app = {};
if (window.localStorage.getItem('app')) {
    app = JSON.parse(window.localStorage.getItem('app'));
} else {
    app.model = {};
    app.model.allCompleted = false;
    app.model.display = 'all';  // ['all', 'active', 'completed']
    app.model.lists = [];
    app.model.lists.push({
        text: 'default item1',
        completed: false
    }, {
        text: 'default item2',
        completed: false
    });
}

// localStorage
window.onunload = function () {
    window.localStorage.setItem('app', JSON.stringify(app));
}

var TodoApp = React.createClass({
    getInitialState: function () {
        var model = this.props.model;
        return {
            model: model
        };
    },
    componentDidUpdate: function () {
        app.model = this.state.model;
    },
    toggleAllCompleted: function () {
        var model = this.state.model;
        model.allCompleted = !model.allCompleted;
        model.lists.forEach(function (list, index, lists) {
            list.completed = model.allCompleted;
        });
        this.setState({
            model: model
        });
    },
    insertNewList: function (text) {
        var model = this.state.model;
        model.lists.push({
            text: text,
            completed: false
        });
        model.allCompleted = false;
        this.setState({
            model: model
        });
    },
    toggleCompleted: function (index) {
        var model = this.state.model;
        model.lists[index].completed = !model.lists[index].completed;
        model.allCompleted = model.lists.every(function (list, index, lists) {
            if (list.completed) {
                return true;
            }
        });
        this.setState({
            model: model
        });
    },
    deleteList: function (index) {
        var model = this.state.model;
        model.lists.splice(index, 1);
        model.allCompleted = model.lists.every(function (list, index, lists) {
            if (list.completed) {
                return true;
            }
        });
        this.setState({
            model: model
        });
    },
    saveListContent: function (index, value) {
        var model = this.state.model;
        model.lists[index].text = value;

        this.setState({
            model: model
        });
    },
    displayWhich: function (which) {
        var model = this.state.model;
        model.display = which;
        this.setState({
            model: model
        });
    },
    clearCompleted: function () {
        var model = this.state.model;
        model.lists = model.lists.filter(function (list, index) {
            if (list.completed) {
                return false;
            } else {
                return true;
            }
        });
        this.setState({
            model: model
        });
    },
    render: function () {
        // to TodoMain
        var lists = this.state.model.lists;
        var display = this.state.model.display;

        // to TodoFooter
        var activeLength = 0 ;
        var hasCompleted = false;
        lists.forEach(function (list, index) {
            if (!list.completed) {
                activeLength++;
            } else {
                hasCompleted = true;
            }
        });
        return (
            <div>
                <TodoHeader model={this.state.model} onToggleAllCompleted={this.toggleAllCompleted} onInsertNewList={this.insertNewList} />
                <TodoMain lists={lists} display={display} onToggleCompleted={this.toggleCompleted} onDeleteList={this.deleteList} onSaveListContent={this.saveListContent} />
                <TodoFooter length={activeLength} hasCompleted={hasCompleted} onDisplayWhich={this.displayWhich} onClearCompleted={this.clearCompleted} />
            </div>
        );
    }
});

var TodoHeader = React.createClass({
    getInitialState: function () {
        var model = this.props.model;
        return {
            inputText: ''
        };
    },
    toggleAllCompleted: function (e) {
        this.props.onToggleAllCompleted();
    },
    inputTextChange: function (e) {
        this.setState({
            inputText: e.target.value
        });
    },
    inputKeyUp: function (e) {
        var keyCode = e.nativeEvent.keyCode || e.nativeEvent.which;
        if (keyCode === 13) {
            this.setState({
                inputText: ''
            });
            this.props.onInsertNewList(this.state.inputText);
        }
    },
    render: function () {
        var iClass = 'icon iconfont ' + (this.props.model.allCompleted ? 'icon-checkbox-checked' : 'icon-checkbox-normal');
        return (
            <header>
                <label onClick={this.toggleAllCompleted}>
                    <i className={iClass}></i>
                </label>
                <p>
                    <input type="text" placeholder="What needs to be done?" onChange={this.inputTextChange} onKeyUp={this.inputKeyUp} value={this.state.inputText} />
                </p>
            </header>
        );
    }
});

var TodoMain = React.createClass({
    getInitialState: function () {
        return {
            // lists: this.props.lists,
            editLiIndex: -1
        };
    },
    toggleCompleted: function (index) {
        this.props.onToggleCompleted(index);
    },
    deleteList: function (index) {
        this.props.onDeleteList(index);
    },
    toEditMode: function (index, e) {
        // console.log(e.target.focus);
        e.target.removeAttribute('disabled');
        e.target.focus();
        this.setState({
            editLiIndex: index
        });
    },
    handleChange: function (index, e) {
        // var lists = this.state.lists;
        var value = e.target.value;

        this.props.onSaveListContent(index, value);
        // lists[index].text = value;
        // this.setState({
        //     lists: lists
        // });
    },
    keyUp: function (index, e) {
        var keyCode = e.nativeEvent.keyCode || e.nativeEvent.which;
        if (keyCode === 13) {
            this.finishEditMode(index, e);
        }
    },
    finishEditMode: function (index, e) {
        // var lists = this.state.lists;
        var value = e.target.value;
        e.target.setAttribute('disabled', true);

        this.props.onSaveListContent(index, value);

        // lists[index].text = value;
        this.setState({
            // lists: lists,
            editLiIndex: -1
        });
    },
    render: function () {
        var that = this;
        var display = this.props.display;
        var listsHTML = this.props.lists.map(function (list, index, lists) {
            var liClass = (list.completed ? 'completed' : '') + (that.state.editLiIndex === index ? ' edit' : '');
            if ((display === 'active' && list.completed) || (display === 'completed' && !list.completed)) {
                liClass += ' hide';
            }
            var iClass = 'icon iconfont ' + (list.completed ? 'icon-checkbox-checked' : 'icon-checkbox-normal');
            return (
                <li className={liClass}>
                    <label onClick={that.toggleCompleted.bind(that, index)}>
                        <i className={iClass}></i>
                    </label>
                    <p>
                        <input type="text" disabled value={list.text} onDoubleClick={that.toEditMode.bind(that, index)} onChange={that.handleChange.bind(that, index)} onBlur={that.finishEditMode.bind(that, index)} onKeyUp={that.keyUp.bind(that, index)} />
                    </p>
                    <i className="icon iconfont delete" onClick={that.deleteList.bind(that, index)} >&#xe600;</i>
                </li>
            );
        });
        return (
            <main>
                <ul>
                    {listsHTML}
                </ul>
            </main>
        );
    }
});

var TodoFooter = React.createClass({
    displayWhich: function (which) {
        this.props.onDisplayWhich(which);
    },
    clearCompleted: function () {
        this.props.onClearCompleted();
    },
    render: function () {
        var len = this.props.length;
        var clearCompletedClassName = 'clear-completed' + (this.props.hasCompleted ? '' : ' hidden');
        return (
            <footer>
                <span>{len > 1 ? len + ' items' : len + ' item'} &nbsp; left</span>
                <div className="select">
                    <button className="all" onClick={this.displayWhich.bind(this, 'all')}>All</button>
                    <button className="active" onClick={this.displayWhich.bind(this, 'active')}>Active</button>
                    <button className="Completed" onClick={this.displayWhich.bind(this, 'completed')}>Completed</button>
                </div>
                <button className={clearCompletedClassName} onClick={this.clearCompleted}>Clear Completed</button>
            </footer>
        );
    }
});

ReactDOM.render(<TodoApp model={app.model} />, document.getElementById('todoapp'));

}())