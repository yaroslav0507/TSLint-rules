/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

/**
 * TSLint rule that verifies proper formatting of JSDOC comments.
 */

export class Rule extends Lint.Rules.AbstractRule
{
    public static PARAMS_FAILURE_STRING = "params in signature must match params described in JsDoc comments";
    public static RETURNS_FAILURE_STRING = "return type in signature must match return type described in JsDoc comments";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[]
    {
        return this.applyWithWalker(new JsDocSignatureWalker(sourceFile, this.getOptions()));
    }
}

class JsDocSignatureWalker extends Lint.RuleWalker {

    public visitNode(node): void
    {
        // rule validations
        this._validateJsDocParams(node);
        this._validateJsDocReturns(node);

        super.visitNode(node);
    }

    private _getJsDocComment(node: ts.Node): any
    {
        const lines = node.getFullText().substring(0, node.getStart() - node.getFullStart()).trim();
        return this._isJsDocFormat(lines) ? lines : false;
    }

    private _isJsDocFormat(lines: string): boolean
    {
        // last lines should be js docs
        return /^\/\*\*\s+(.|\s)+\s+\*\/$/.test(lines);
    }

    private _arraysAreEqual(arr1, arr2): boolean
    {
        if(arr1 && arr2 && (arr1.length === arr2.length))
        {
            return arr1.every((element, index) => {
                return JSON.stringify(element) === JSON.stringify(arr2[index]);
            });
        } else {
            return false;
        }
    }

    private _isFunctionLikeSignature(node: ts.Node): boolean
    {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            || node.kind === ts.SyntaxKind.MethodDeclaration;
    }

    private _isJsDocRequired(node: ts.Node): boolean
    {
        const syntaxKinds = [
            ts.SyntaxKind.PropertyDeclaration,
            ts.SyntaxKind.FunctionDeclaration,
            ts.SyntaxKind.MethodDeclaration,
            ts.SyntaxKind.Constructor,
            ts.SyntaxKind.ModuleDeclaration,
            ts.SyntaxKind.ClassDeclaration,
            ts.SyntaxKind.InterfaceDeclaration
        ];

        return syntaxKinds.indexOf(node.kind) !== -1;
    }

    private _validateJsDocParams(node: ts.FunctionLikeDeclaration): void
    {
        if(this._isFunctionLikeSignature(node) && this._getJsDocComment(node))
        {
            const jsDocParams = this._getJsDocParams(node);
            const signatureParams = this._getSignatureParams(node);
            const jsDocParamsMatchSignature = this._arraysAreEqual(jsDocParams, signatureParams);

            // create failure when some params described in JsDoc do not match parameters of signature
            if(jsDocParams && !jsDocParamsMatchSignature)
            {
                const failure = this.createFailure(node.getStart(), node.getWidth(), Rule.PARAMS_FAILURE_STRING);
                this.addFailure(failure);
            }
        }
    }

    private _validateJsDocReturns(node: ts.Node)
    {
        if(this._isFunctionLikeSignature(node))
        {
            const jsDocReturns = this._getJsDocReturns(node);
            const signatureReturns = this._getSignatureReturns(node);

            if(jsDocReturns && (jsDocReturns !== signatureReturns))
            {
                const failure = this.createFailure(node.getStart(), node.getWidth(), Rule.RETURNS_FAILURE_STRING);
                this.addFailure(failure);
            }
        }
    }

    private _getSignatureParams(node): Array<Object>
    {
        if(node.parameters)
        {
            let signatureParams = [];

            node.parameters.forEach(argument => {
                const argumentType = argument.type && argument.type.getText();

                signatureParams.push({
                    name: argument.name.getText(),
                    type: argumentType
                });
            });

            return signatureParams;
        }
    }

    private _getJsDocParams(node): Array<Object>
    {
        if (this._isJsDocRequired(node))
        {
            const PARAM_REGEX = /@param\s+\{\s*([\s\S]*?)\s*}\s+(\S+)/g;
            const comment = this._getJsDocComment(node);
            let jsDocParams = [];

            if (comment)
            {
                let result;

                do {
                    result = PARAM_REGEX.exec(comment);

                    if (result && result.length)
                    {
                        jsDocParams.push({
                            name: result[2],
                            type: result[1]
                        });
                    }
                } while (result);
            }

            return jsDocParams.length && jsDocParams;
        }
    }

    private _getJsDocReturns(node: ts.Node): string
    {
        if (this._isJsDocRequired(node))
        {
            const RETURN_REGEX = /@returns\s+\{\s*([\s\S]*?)\s*}\s+(\S+)/g;
            const comment = this._getJsDocComment(node);
            const returnInstance = RETURN_REGEX.exec(comment);

            return returnInstance && returnInstance[1];
        }
    }

    private _getSignatureReturns(node): string
    {
        return node.type && node.type.getText();
    }
}
