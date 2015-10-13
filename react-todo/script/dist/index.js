(function () {

var app = app || {};
app.model = {};
// app.model.inputText = '';
app.model.allCompleted = false;
app.model.display = 'all';  // ['all', 'active', 'completed']
app.model.lists = [];
app.model.lists.push({
    text: 'study angular',
    completed: true
}, {
    text: 'study react',
    completed: false
})

var TodoApp = React.createClass({displayName: "TodoApp",
    getInitialState: function () {
        var model = this.props.model;
        return {
            model: model
        };
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
        var activeLength = 0 ;
        var hasCompleted = false;
        this.state.model.lists.forEach(function (list, index) {
            if (!list.completed) {
                activeLength++;
            } else {
                hasCompleted = true;
            }
        });
        return (
            React.createElement("div", null, 
                React.createElement(TodoHeader, {model: this.state.model, onToggleAllCompleted: this.toggleAllCompleted, onInsertNewList: this.insertNewList}), 
                React.createElement(TodoMain, {model: this.state.model, onToggleCompleted: this.toggleCompleted, onDeleteList: this.deleteList}), 
                React.createElement(TodoFooter, {length: activeLength, hasCompleted: hasCompleted, onDisplayWhich: this.displayWhich, onClearCompleted: this.clearCompleted})
            )
        );
    }
});

var TodoHeader = React.createClass({displayName: "TodoHeader",
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
        if (e.nativeEvent.keyCode === 13) {
            this.setState({
                inputText: ''
            });
            this.props.onInsertNewList(this.state.inputText);
        }
    },
    render: function () {
        var iClass = 'icon iconfont ' + (this.props.model.allCompleted ? 'icon-checkbox-checked' : 'icon-checkbox-normal');
        return (
            React.createElement("header", null, 
                React.createElement("label", {onClick: this.toggleAllCompleted}, 
                    React.createElement("i", {className: iClass})
                ), 
                React.createElement("input", {type: "text", placeholder: "What needs to be done?", onChange: this.inputTextChange, onKeyUp: this.inputKeyUp, value: this.state.inputText})
            )
        );
    }
});

var TodoMain = React.createClass({displayName: "TodoMain",
    getInitialState: function () {
        return {
            text: ''
        };
    },
    toggleCompleted: function (index) {
        this.props.onToggleCompleted(index);
    },
    deleteList: function (index) {
        this.props.onDeleteList(index);
    },
    toEditMode: function (e) {
        // console.log(e.target.focus);
        e.target.removeAttribute('disabled');
        e.target.focus();
    },
    saveListContent: function (index, e) {
        var value = e.target.value;
        this.props.onSaveListContent(index, value);
    },
    render: function () {
        var that = this;
        var display = this.props.model.display;
        var listsHTML = this.props.model.lists.filter(function (list, index, lists) {
            if (display === 'all') {
                return true;
            } else if (display === 'active' && !list.completed) {
                return true;
            } else if (display === 'completed' && list.completed) {
                return true;
            }
            return false;
        })
        .map(function (list, index, lists) {
            var iClass = 'icon iconfont ' + (list.completed ? 'icon-checkbox-checked' : 'icon-checkbox-normal');
            return (
                React.createElement("li", {className: list.completed ? 'completed' : ''}, 
                    React.createElement("label", {onClick: that.toggleCompleted.bind(that, index)}, 
                        React.createElement("i", {className: iClass})
                    ), 
                    React.createElement("input", {type: "text", disabled: true, value: list.text, onDoubleClick: that.toEditMode, onBlur: that.saveListContent.bind(that, index)}), 
                    React.createElement("i", {className: "icon iconfont delete", onClick: that.deleteList.bind(that, index)}, "")
                )
            );
        });
        return (
            React.createElement("main", null, 
                React.createElement("ul", null, 
                    listsHTML
                )
            )
        );
    }
});

var TodoFooter = React.createClass({displayName: "TodoFooter",
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
            React.createElement("footer", null, 
                React.createElement("span", null, len > 1 ? len + ' items' : len + ' item', "   left"), 
                React.createElement("div", {className: "select"}, 
                    React.createElement("button", {className: "all", onClick: this.displayWhich.bind(this, 'all')}, "All"), 
                    React.createElement("button", {className: "active", onClick: this.displayWhich.bind(this, 'active')}, "Active"), 
                    React.createElement("button", {className: "Completed", onClick: this.displayWhich.bind(this, 'completed')}, "Completed")
                ), 
                React.createElement("button", {className: clearCompletedClassName, onClick: this.clearCompleted}, "Clear Completed")
            )
        );
    }
});


ReactDOM.render(React.createElement(TodoApp, {model: app.model}), document.getElementById('todoapp'));

}())