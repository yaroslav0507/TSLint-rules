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
 * TSLint rule that verifies proper formatting of JSDOC comments.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new JsDocSignatureWalker(sourceFile, this.getOptions()));
    };
    Rule.PARAMS_FAILURE_STRING = "params in signature must match params described in JsDoc comments";
    Rule.RETURNS_FAILURE_STRING = "return type in signature must match return type described in JsDoc comments";
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var JsDocSignatureWalker = (function (_super) {
    __extends(JsDocSignatureWalker, _super);
    function JsDocSignatureWalker() {
        _super.apply(this, arguments);
    }
    JsDocSignatureWalker.prototype.visitNode = function (node) {
        // rule validations
        this._validateJsDocParams(node);
        this._validateJsDocReturns(node);
        _super.prototype.visitNode.call(this, node);
    };
    JsDocSignatureWalker.prototype._getJsDocComment = function (node) {
        var lines = node.getFullText().substring(0, node.getStart() - node.getFullStart()).trim();
        return this._isJsDocFormat(lines) ? lines : false;
    };
    JsDocSignatureWalker.prototype._isJsDocFormat = function (lines) {
        // last lines should be js docs
        return /^\/\*\*\s+(.|\s)+\s+\*\/$/.test(lines);
    };
    JsDocSignatureWalker.prototype._arraysAreEqual = function (arr1, arr2) {
        if (arr1 && arr2 && (arr1.length === arr2.length)) {
            return arr1.every(function (element, index) {
                return JSON.stringify(element) === JSON.stringify(arr2[index]);
            });
        }
        else {
            return false;
        }
    };
    JsDocSignatureWalker.prototype._isFunctionLikeSignature = function (node) {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            || node.kind === ts.SyntaxKind.MethodDeclaration;
    };
    JsDocSignatureWalker.prototype._isJsDocRequired = function (node) {
        var syntaxKinds = [
            ts.SyntaxKind.PropertyDeclaration,
            ts.SyntaxKind.FunctionDeclaration,
            ts.SyntaxKind.MethodDeclaration,
            ts.SyntaxKind.Constructor,
            ts.SyntaxKind.ModuleDeclaration,
            ts.SyntaxKind.ClassDeclaration,
            ts.SyntaxKind.InterfaceDeclaration
        ];
        return syntaxKinds.indexOf(node.kind) !== -1;
    };
    JsDocSignatureWalker.prototype._validateJsDocParams = function (node) {
        if (this._isFunctionLikeSignature(node) && this._getJsDocComment(node)) {
            var jsDocParams = this._getJsDocParams(node);
            var signatureParams = this._getSignatureParams(node);
            var jsDocParamsMatchSignature = this._arraysAreEqual(jsDocParams, signatureParams);
            // create failure when some params described in JsDoc do not match parameters of signature
            if (jsDocParams && !jsDocParamsMatchSignature) {
                var failure = this.createFailure(node.getStart(), node.getWidth(), Rule.PARAMS_FAILURE_STRING);
                this.addFailure(failure);
            }
        }
    };
    JsDocSignatureWalker.prototype._validateJsDocReturns = function (node) {
        if (this._isFunctionLikeSignature(node)) {
            var jsDocReturns = this._getJsDocReturns(node);
            var signatureReturns = this._getSignatureReturns(node);
            if (jsDocReturns && (jsDocReturns !== signatureReturns)) {
                var failure = this.createFailure(node.getStart(), node.getWidth(), Rule.RETURNS_FAILURE_STRING);
                this.addFailure(failure);
            }
        }
    };
    JsDocSignatureWalker.prototype._getSignatureParams = function (node) {
        if (node.parameters) {
            var signatureParams_1 = [];
            node.parameters.forEach(function (argument) {
                var argumentType = argument.type && argument.type.getText();
                signatureParams_1.push({
                    name: argument.name.getText(),
                    type: argumentType
                });
            });
            return signatureParams_1;
        }
    };
    JsDocSignatureWalker.prototype._getJsDocParams = function (node) {
        if (this._isJsDocRequired(node)) {
            var PARAM_REGEX = /@param\s+\{\s*([\s\S]*?)\s*}\s+(\S+)/g;
            var comment = this._getJsDocComment(node);
            var jsDocParams = [];
            if (comment) {
                var result = void 0;
                do {
                    result = PARAM_REGEX.exec(comment);
                    if (result && result.length) {
                        jsDocParams.push({
                            name: result[2],
                            type: result[1]
                        });
                    }
                } while (result);
            }
            return jsDocParams.length && jsDocParams;
        }
    };
    JsDocSignatureWalker.prototype._getJsDocReturns = function (node) {
        if (this._isJsDocRequired(node)) {
            var RETURN_REGEX = /@returns\s+\{\s*([\s\S]*?)\s*}\s+(\S+)/g;
            var comment = this._getJsDocComment(node);
            var returnInstance = RETURN_REGEX.exec(comment);
            return returnInstance && returnInstance[1];
        }
    };
    JsDocSignatureWalker.prototype._getSignatureReturns = function (node) {
        return node.type && node.type.getText();
    };
    return JsDocSignatureWalker;
}(Lint.RuleWalker));
