/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";

/**
 * TSLint rule that verifies that export statements end with semicolon sign.
 */

export class Rule extends Lint.Rules.AbstractRule
{
    public static FAILURE_STRING = 'export statements must end with semicolon';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[]
    {
        return this.applyWithWalker(new semicolonAfterExportWalker(sourceFile, this.getOptions()));
    }
}

class semicolonAfterExportWalker extends Lint.RuleWalker
{
    protected visitNode(node: ts.Node): void
    {
        switch (node.kind)
        {
            case ts.SyntaxKind.ExportDeclaration:
                this.visitExportDeclaration(<ts.ExportDeclaration> node);
                break;
            default:
                this.walkChildren(node);
                break;
        }
    }

    protected visitExportDeclaration(exportDeclaration: ts.ExportDeclaration): void
    {
        if(!this.hasSemicolonAtTheEnd(exportDeclaration))
        {
            this.addFailure(
                this.createFailure(exportDeclaration.getEnd(), 0, Rule.FAILURE_STRING));
        }
    }

    private hasSemicolonAtTheEnd(exportDeclaration: ts.ExportDeclaration): boolean
    {
        const SEMICOLON_SIGN = ';';
        const exportSubject = exportDeclaration.getText();

        return exportSubject.slice(-1) === SEMICOLON_SIGN;
    }

}
