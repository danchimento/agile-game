import $ from 'jquery';
import projects from './data/projects.json';
import tasks from './data/tasks.json';
import { rand } from '../Util';

export default class ProjectTracker {
    _project;
    _task;
    _taskNum;
    _remainingWork;
    _projectNum;

    _$elem;
    _$projectName;
    _$projectNumber;
    _$taskName;
    _$percentCompletion;
    _$currentTaskNum;
    _$totalTaskNum;
    _$taskProgressValue;
    _$taskProgressCompletion;

    _onProjectCompleted;


    constructor($elem, onProjectCompleted) {
        this._$elem = $elem;
        this._onProjectCompleted = onProjectCompleted;
        this._projectNum = 0;

        this._$projectName = $("#project-name");
        this._$taskName = $("#task-name");
        this._$currentTaskNum = $("#current-task-num");
        this._$totalTaskNum = $("#total-task-num");
        this._$taskProgressValue = $("#task-progress-value");
        this._$taskProgressCompletion = $("#task-progress-completion");
        this._$projectNumber = $("#project-number");
    }

    loadNextProject() {
        this._project = this._generateProject(this._projectNum++);
        this._$projectName.text(this._project.title);
        this._$projectNumber.text(this._projectNum);
        this._taskNum = 0;
        
        this._startNextTask()
    }

    progressTask(amount) {
        this._remainingWork -= amount;
        this._$taskProgressValue.text(`${this._project.taskEffort - this._remainingWork}/${this._project.taskEffort}`);
        
        var percentageComletion = parseInt(100 - (this._remainingWork / this._project.taskEffort * 100));
        this._$taskProgressCompletion.css({ width: `${percentageComletion}%` });

        if (this._remainingWork <= 0) {
            this._startNextTask();
        }
    }
    
    _startNextTask() {
        this._taskNum++;

        if (this._taskNum > this._project.numTasks) {
            this._onProjectCompleted(this._project);
            return;
        }

        this._remainingWork = this._project.taskEffort;

        this._$currentTaskNum.text(this._taskNum);
        this._$totalTaskNum.text(this._project.numTasks);
        this._$taskName.text(this._project.tasks[this._taskNum-1]);
        this._$taskProgressValue.text(`0/${this._project.taskEffort}`);
        this._$taskProgressCompletion.css({ width: 0 });
    }

    _generateProject(number) {
        this._project = {
            title: projects[number],
            numTasks: 1 + parseInt(number / 3),
            taskEffort: 50 * (number+1),
            tasks: [],
            revenue: 100 * (number+1)
        };

        for (var i = 0; i < this._project.numTasks; i++) {
            var randVerbIndex = rand(0, tasks.verbs.length - 1);
            var randNounIndex = rand(0, tasks.nouns.length - 1);

            var verb = tasks.verbs[randVerbIndex];
            var noun = tasks2.nouns[randNounIndex]

            this._project.tasks.push(`${verb} the ${noun}`);
        }

        return this._project;
    }
}