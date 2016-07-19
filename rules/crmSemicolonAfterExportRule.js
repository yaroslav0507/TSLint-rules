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
 * TSLint rule that verifies that export statements end with semicolon sign.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new semicolonAfterExportWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'export statements must end with semicolon';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var semicolonAfterExportWalker = (function (_super) {
    __extends(semicolonAfterExportWalker, _super);
    function semicolonAfterExportWalker() {
        _super.apply(this, arguments);
    }
    semicolonAfterExportWalker.prototype.visitNode = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.ExportDeclaration:
                this.visitExportDeclaration(node);
                break;
            default:
                this.walkChildren(node);
                break;
        }
    };
    semicolonAfterExportWalker.prototype.visitExportDeclaration = function (exportDeclaration) {
        if (!this.hasSemicolonAtTheEnd(exportDeclaration)) {
            this.addFailure(this.createFailure(exportDeclaration.getEnd(), 0, Rule.FAILURE_STRING));
        }
    };
    semicolonAfterExportWalker.prototype.hasSemicolonAtTheEnd = function (exportDeclaration) {
        var SEMICOLON_SIGN = ';';
        var exportSubject = exportDeclaration.getText();
        return exportSubject.slice(-1) === SEMICOLON_SIGN;
    };
    return semicolonAfterExportWalker;
}(Lint.RuleWalker));
