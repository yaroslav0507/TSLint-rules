/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("tslint/lib/lint");
/**
 * TSLint rule that verifies absence of semicolons after function definitions.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new noSemicolonAfterFunctionDeclarationWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'function definition must not end with semicolon';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var noSemicolonAfterFunctionDeclarationWalker = (function (_super) {
    __extends(noSemicolonAfterFunctionDeclarationWalker, _super);
    function noSemicolonAfterFunctionDeclarationWalker() {
        _super.apply(this, arguments);
    }
    noSemicolonAfterFunctionDeclarationWalker.prototype.visitFunctionDeclaration = function (node) {
        this.checkForSemicolonAtTheEnd(node);
        this.walkChildren(node);
    };
    noSemicolonAfterFunctionDeclarationWalker.prototype.visitMethodDeclaration = function (node) {
        this.checkForSemicolonAtTheEnd(node);
        this.walkChildren(node);
    };
    noSemicolonAfterFunctionDeclarationWalker.prototype.checkForSemicolonAtTheEnd = function (node) {
        if (this.hasSemicolonAtTheEnd(node)) {
            this.addFailure(this.createFailure(node.getEnd(), 0, Rule.FAILURE_STRING));
        }
    };
    noSemicolonAfterFunctionDeclarationWalker.prototype.hasSemicolonAtTheEnd = function (node) {
        var SEMICOLON_SIGN = ';';
        var functionDefinitionEnd = node.getEnd();
        var nextCharacter = node.getSourceFile().text.substr(functionDefinitionEnd, 1);
        return nextCharacter === SEMICOLON_SIGN;
    };
    return noSemicolonAfterFunctionDeclarationWalker;
}(Lint.RuleWalker));
