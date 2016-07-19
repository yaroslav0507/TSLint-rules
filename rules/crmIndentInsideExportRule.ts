/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

import * as ts from "typescript";
import * as Lint from "tslint/lib/lint";
import { getIsRuleEnabled } from "../TslintProvider";

/**
 * TSLint rule that verifies that export statements are properly formatted.
 */

export class Rule extends Lint.Rules.AbstractRule
{
    public static TAB_VALIDATION_FAILURE_STRING = "multi line export statements must be formatted with one tab";
    public static SPACE_VALIDATION_FAILURE_STRING = "one line export statements must be formatted with spaces";
    public static LAST_SPACE_FAILURE_STRING = "one line export declaration should end with space before curly brace";
    public static MULTI_LINE_TABS_INDENT = "multi-line-tabs";
    public static SINGLE_LINE_SPACES_INDENT = "single-line-spaces";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[]
    {
        console.log(Lint.loadRules());
        return this.applyWithWalker(new tabIndentInsideMultiLineExportWalker(sourceFile, this.getOptions()));
    }
}

class tabIndentInsideMultiLineExportWalker extends Lint.RuleWalker
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
        const exportEntities = exportDeclaration.exportClause.elements;
        const exportDeclarationText = exportDeclaration.getText();

        if(this._ruleArgumentExists(Rule.MULTI_LINE_TABS_INDENT) && this._isMultiLine(exportDeclarationText))
        {
            this._validateTabIndents(exportEntities);
        }

        if (this._ruleArgumentExists(Rule.SINGLE_LINE_SPACES_INDENT) && !this._isMultiLine(exportDeclarationText))
        {
            this._validateSpaceIndents(exportDeclaration);
        }

    }

    private _validateSpaceIndents(exportDeclaration: ts.ExportDeclaration): void
    {
        const exportSubjectNode = exportDeclaration.exportClause;
        const exportDeclarationText = exportSubjectNode.getText();
        const isFormattedWithSpaces = /\{[ ](?:(?:\S.*\S)|(?:\S))[ ]}/.test(exportDeclarationText);

        if (!isFormattedWithSpaces)
        {
            this.addFailure(
                this.createFailure(exportSubjectNode.getStart(), exportSubjectNode.getWidth(), Rule.SPACE_VALIDATION_FAILURE_STRING));
        }
    }

    private _validateTabIndents(exportEntities): void
    {
        exportEntities.forEach(entity => {
            const entityLines = entity.getFullText().split("\n");           // split entity string for line breaks
            const entityName = entityLines[entityLines.length - 1];         // get the actual name of exported entity
            const startsWithTab = entityName.match(/^\t\S/g);               // check that name starts with only tab

            if(!startsWithTab)
            {
                const indexOfFirstLetter = entityName.search(/\S/);         // get index of the first letter in string
                const lineStart = entity.getStart() - indexOfFirstLetter;   // get position of the line start

                this.addFailure(
                    this.createFailure(lineStart, indexOfFirstLetter, Rule.TAB_VALIDATION_FAILURE_STRING));
            }
        });
    }

    private _isMultiLine(string: string): boolean
    {
        return string.indexOf("\n") !== -1;
    }

    private _ruleArgumentExists(ruleArgument: string): boolean
    {
        return this.options.indexOf(ruleArgument) !== -1;
    }
}
