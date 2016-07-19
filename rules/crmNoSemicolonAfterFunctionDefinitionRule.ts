/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

/**
 * TSLint rule that verifies absence of semicolons after function definitions.
 */

export class Rule extends Lint.Rules.AbstractRule
{
    public static FAILURE_STRING = 'function definition must not end with semicolon';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[]
    {
        return this.applyWithWalker(new noSemicolonAfterFunctionDeclarationWalker(sourceFile, this.getOptions()));
    }
}

class noSemicolonAfterFunctionDeclarationWalker extends Lint.RuleWalker
{
    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void
    {
        this.checkForSemicolonAtTheEnd(node);
        this.walkChildren(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void
    {
        this.checkForSemicolonAtTheEnd(node);
        this.walkChildren(node);
    }

    private checkForSemicolonAtTheEnd(node): void
    {
        if(this.hasSemicolonAtTheEnd(node))
        {
            this.addFailure(
                this.createFailure(node.getEnd(), 0, Rule.FAILURE_STRING));
        }
    }

    private hasSemicolonAtTheEnd(node: ts.ExportDeclaration): boolean
    {
        const SEMICOLON_SIGN = ';';
        const functionDefinitionEnd = node.getEnd();
        const nextCharacter = node.getSourceFile().text.substr(functionDefinitionEnd, 1);

        return nextCharacter === SEMICOLON_SIGN;
    }
}
