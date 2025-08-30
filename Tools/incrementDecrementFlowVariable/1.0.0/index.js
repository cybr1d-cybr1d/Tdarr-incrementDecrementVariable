"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
var details = function () { return ({
    name: "Increment/Decrement Flow Variable",
  description:
    "Increment or decrement a named Flow Variable by 1. Useful for loop counters or stage tracking. " +
    "If the variable does not exist or is not numeric, it is treated as 0 before applying the change.",
  style: {
    borderColor: "green",
  },
  tags: "",
  isStartPlugin: false,
  pType: "",
  requiresVersion: "2.11.01",
  sidebarPosition: 1,
  icon: "",
  inputs: [
    {
      label: "Variable",
      name: "variable",
      type: "string",
      defaultValue: "",
      inputUI: { type: "text" },
      tooltip:
        "Name of the variable to modify.\n\nExample\ncounter\n\nYou can view it elsewhere with:\n{{{args.variables.user.counter}}}\n",
    },
    {
      label: "Operation",
      name: "operation",
      type: "string",
      defaultValue: "inc",
      inputUI: {
        type: "dropdown",
        options: [
          { label: "Increment", value: "inc" },
          { label: "Decrement", value: "dec" },
        ],
      },
      tooltip: "Choose whether to increment or decrement the variable by 1.",
    },
  ],
  outputs: [
    {
      number: 1,
      tooltip: "Continue to next plugin",
    },
  ],
}); };
exports.details = details;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var plugin = function (args) {
    var lib = require('../../../../../methods/lib')();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
    args.inputs = lib.loadDefaultValues(args.inputs, details);
    var variable = String(args.inputs.variable).trim();
	var operation = String(args.inputs.operation || "inc").toLowerCase();
	
    if (!args.variables.user) {
        // eslint-disable-next-line no-param-reassign
        args.variables.user = {};
    }
	
	if (!variable) {
		args.jobLog("Increment/Decrement: No variable name provided. Skipping.");
		return {
			outputFileObj: args.inputFileObj,
			outputNumber: 1,
			variables: args.variables,
		};
	}
	
	var rawCurrent = args.variables.user[variable];
	var currentNum = Number(rawCurrent);
	var safeCurrent = Number.isFinite(currentNum) ? currentNum : 0;
	
	var delta = operation === "dec" ? -1 : 1;
	var nextVal = safeCurrent + delta;
	
	args.jobLog(
		`Changing variable "${variable}": ${safeCurrent} ${delta > 0 ? "+" : "-"} 1 => ${nextVal}`
	);
	
	args.variables.user[variable] = String(nextVal);
	
    return {
        outputFileObj: args.inputFileObj,
        outputNumber: 1,
        variables: args.variables,
    };
};
exports.plugin = plugin;