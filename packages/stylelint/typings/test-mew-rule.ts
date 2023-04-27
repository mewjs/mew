interface RuleTestCase {
    plugins?: string | string[];
    ruleName: string;
    fix?: boolean;
    skipBasicChecks?: boolean;
    customSyntax?: string;
    codeFilename?: string;
    only?: boolean;
    skip?: boolean;
    // config: RuleTestCase.Config;
    config: any;
    accept: RuleTestCase.Accept[];
    reject: RuleTestCase.Reject[];
}

declare namespace RuleTestCase {
    type ConfigValue = string | number | boolean;
    type Config = [ConfigValue] | { [key: string]: ConfigValue }

    interface Accept {
        code: string;
        description?: string;
        skip?: boolean;
        only?: boolean;
    }

    interface Warning {
        message: string;
        line: number;
        column: number;
    }

    interface Reject extends Accept{
        message: string;
        fixed?: string;
        unfixable?: boolean;
        line: number;
        column?: number;
        warnings?: Warning[];
    }
}


declare let testMewRule: (cases: RuleTestCase) => void;
