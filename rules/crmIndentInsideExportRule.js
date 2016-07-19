/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require("typescript");
var Lint = require("tslint/lib/lint");
/**
 * TSLint rule that verifies that export statements are properly formatted.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        console.log(Lint.loadRules());
        return this.applyWithWalker(new tabIndentInsideMultiLineExportWalker(sourceFile, this.getOptions()));
    };
    Rule.TAB_VALIDATION_FAILURE_STRING = "multi line export statements must be formatted with one tab";
    Rule.SPACE_VALIDATION_FAILURE_STRING = "one line export statements must be formatted with spaces";
    Rule.LAST_SPACE_FAILURE_STRING = "one line export declaration should end with space before curly brace";
    Rule.MULTI_LINE_TABS_INDENT = "multi-line-tabs";
    Rule.SINGLE_LINE_SPACES_INDENT = "single-line-spaces";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var tabIndentInsideMultiLineExportWalker = (function (_super) {
    __extends(tabIndentInsideMultiLineExportWalker, _super);
    function tabIndentInsideMultiLineExportWalker() {
        _super.apply(this, arguments);
    }
    tabIndentInsideMultiLineExportWalker.prototype.visitNode = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.ExportDeclaration:
                this.visitExportDeclaration(node);
                break;
            default:
                this.walkChildren(node);
                break;
        }
    };
    tabIndentInsideMultiLineExportWalker.prototype.visitExportDeclaration = function (exportDeclaration) {
        var exportEntities = exportDeclaration.exportClause.elements;
        var exportDeclarationText = exportDeclaration.getText();
        if (this._ruleArgumentExists(Rule.MULTI_LINE_TABS_INDENT) && this._isMultiLine(exportDeclarationText)) {
            this._validateTabIndents(exportEntities);
        }
        if (this._ruleArgumentExists(Rule.SINGLE_LINE_SPACES_INDENT) && !this._isMultiLine(exportDeclarationText)) {
            this._validateSpaceIndents(exportDeclaration);
        }
    };
    tabIndentInsideMultiLineExportWalker.prototype._validateSpaceIndents = function (exportDeclaration) {
        var exportSubjectNode = exportDeclaration.exportClause;
        var exportDeclarationText = exportSubjectNode.getText();
        var isFormattedWithSpaces = /\{[ ](?:(?:\S.*\S)|(?:\S))[ ]}/.test(exportDeclarationText);
        if (!isFormattedWithSpaces) {
            this.addFailure(this.createFailure(exportSubjectNode.getStart(), exportSubjectNode.getWidth(), Rule.SPACE_VALIDATION_FAILURE_STRING));
        }
    };
    tabIndentInsideMultiLineExportWalker.prototype._validateTabIndents = function (exportEntities) {
        var _this = this;
        exportEntities.forEach(function (entity) {
            var entityLines = entity.getFullText().split("\n"); // split entity string for line breaks
            var entityName = entityLines[entityLines.length - 1]; // get the actual name of exported entity
            var startsWithTab = entityName.match(/^\t\S/g); // check that name starts with only tab
            if (!startsWithTab) {
                var indexOfFirstLetter = entityName.search(/\S/); // get index of the first letter in string
                var lineStart = entity.getStart() - indexOfFirstLetter; // get position of the line start
                _this.addFailure(_this.createFailure(lineStart, indexOfFirstLetter, Rule.TAB_VALIDATION_FAILURE_STRING));
            }
        });
    };
    tabIndentInsideMultiLineExportWalker.prototype._isMultiLine = function (string) {
        return string.indexOf("\n") !== -1;
    };
    tabIndentInsideMultiLineExportWalker.prototype._ruleArgumentExists = function (ruleArgument) {
        return this.options.indexOf(ruleArgument) !== -1;
    };
    return tabIndentInsideMultiLineExportWalker;
}(Lint.RuleWalker));
