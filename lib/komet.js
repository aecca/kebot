'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Komet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _kometUtil = require('./komet-util.js');

var _ = _interopRequireWildcard(_kometUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Komet = exports.Komet = function (_EventEmitter) {
	_inherits(Komet, _EventEmitter);

	function Komet() {
		_classCallCheck(this, Komet);

		var _this = _possibleConstructorReturn(this, (Komet.__proto__ || Object.getPrototypeOf(Komet)).call(this));

		_this.tasks = {};
		return _this;
	}
	/**
  * @param {object} config - Whether it is dependent or not.
  */


	_createClass(Komet, [{
		key: 'task',
		value: function task(config) {
			this.orchestratorValidateString(config);
			if (config.dependencies) {
				if (!Array.isArray(config.dependencies)) {
					throw new Error('Dependencies require a array');
				}
				config.dependencies.forEach(function (dep) {
					if (typeof dep !== 'string') {
						throw new Error('Dependency name ' + dep + ' needs to be a string');
					}
				});
			}
			this.tasks[config.alias] = config;
		}
	}, {
		key: 'orchestratorValidateString',
		value: function orchestratorValidateString(config) {
			this.validateString(config.alias);
			this.validateString(config.entry);
		}
	}, {
		key: 'validateString',
		value: function validateString(entity) {
			if (entity && typeof entity !== 'string') {
				throw new Error(entity + ' needs to be a string');
			}
		}
		/**
   * @param {array} tastas - kask from cli.
   * @param {boolean} option - Whether it is dependent or not.
   */

	}, {
		key: 'start',
		value: function start(task, option) {
			var that = this;
			var foundTask = void 0;
			if (!task) {
				throw new Error('Not alias task for argument');
			}
			for (var alias in that.tasks) {
				if (alias === task) {
					foundTask = that.tasks[alias];
				}
			}
			if (foundTask) {
				that.armedTasks(foundTask, option);
			} else {
				this.emit('task_not_found', task);
			}
		}
		/**
   * @param {array} tastas - kask from cli.
   * @param {boolean} option -Whether it is dependent or not.
   */

	}, {
		key: 'armedTasks',
		value: function armedTasks(task, option) {
			var that = this;
			var param = {
				that: that,
				task: task
			};
			if (task.dependsof && option) {
				that.dependencies(task);
			} else {
				_.execute(param);
			}
			if (!task.entry && !option && task.dependsof) {
				that.emit("task_not_entry", task);
			}
		}
		/**
   * @param {object} task - Configuration to run the script with dependencies.
   */

	}, {
		key: 'dependencies',
		value: function dependencies(task) {
			var that = this;
			var tasksRun = {};
			var lengthTask = task.dependsof.length;
			for (var alias in that.tasks) {
				for (var i = 0; i < lengthTask; i++) {
					if (alias === task.dependsof[i]) {
						tasksRun[alias] = that.tasks[alias];
					}
				}
			}
			tasksRun[task.alias] = task;
			this.dependenciesRun(tasksRun);
		}
		/**
   * @param {object} tasksRun - All configurations to run.
   */

	}, {
		key: 'dependenciesRun',
		value: function dependenciesRun(tasksRun) {
			var that = this;
			var task = void 0;
			var params = void 0;
			var runRecursive = function runRecursive(tasksRun) {
				if (Object.keys(tasksRun).length) {
					task = _.shiftObject(tasksRun);
					params = {
						that: that,
						task: task,
						tasksRun: tasksRun,
						callback: runRecursive
					};
					_.execute(params);
				}
			};
			runRecursive(tasksRun);
		}
	}]);

	return Komet;
}(_events2.default);