var path = require("path");
var fs = require("fs");
var chai = require("chai");
var expect = require("chai").expect;
var chaiHtml  = require('chai-html');
chai.use(chaiHtml);
var typewiz = require('typewiz-core');

var utils = require("./utils");

function readFile(filePath) {
    if(path.extname(filePath) === ".emf" || path.extname(filePath) === ".wmf"){
        return fs.readFileSync(filePath).buffer;
    } else {
        return fs.readFileSync(filePath, {encoding: "utf-8"}).trim();
    }
}

function getTestFiles(testType) {
    var testFileRoot = path.join(__dirname, testType + "-test-files");

    return fs.readdirSync(testFileRoot).map(function(dir) {
        if (testType === "rtf"){
            return {
                name: dir,
                dir: path.join(testFileRoot, dir),
                source: readFile(path.join(testFileRoot, dir, "source.rtf")),
                expectedHtml: readFile(path.join(testFileRoot, dir, "expected.html")),
                expectedMetadata: JSON.parse(readFile(path.join(testFileRoot, dir, "expected-metadata.json"))),
            };
        } else if (testType === "emf" || testType === "wmf"){
            return {
                name: dir,
                dir: path.join(testFileRoot, dir),
                source: readFile(path.join(testFileRoot, dir, "source." + testType)),
                expectedSvg: readFile(path.join(testFileRoot, dir, "expected.svg"))
            };
        }
    });
};

describe("Test files", function() {
    var $_$twiz;
    const tableRegressionRtf = String.raw`{\rtf1\ansi\deff0
{\fonttbl{\f0 Arial;}}
{\colortbl;\red0\green0\blue0;}
\pard
\trowd\trql\trleft0
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx1000
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx2000
\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx2300
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx3300
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx4300
\intbl\b Left\cell\intbl\cell\intbl\cell\intbl\b Right\cell\intbl\cell\row
\trowd\trql\trleft0
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx1000
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx1500
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx2000
\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx2300
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx3300
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx3800
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx4300
\intbl Left label\cell\intbl 1\cell\intbl (0-1)\cell\intbl\cell\intbl Right label\cell\intbl 2\cell\intbl (0-2)\cell\row
\trowd\trql\trleft0
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx1000
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx2000
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\clvmgf\cellx3000
\intbl Merge label\cell\intbl Merge value\cell\intbl rowspan start\cell\row
\trowd\trql\trleft0
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx1000
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\cellx2000
\clbrdrt\brdrs\brdrw10\brdrcf1\clbrdrl\brdrs\brdrw10\brdrcf1\clbrdrb\brdrs\brdrw10\brdrcf1\clbrdrr\brdrs\brdrw10\brdrcf1\clvmrg\cellx3000
\intbl Next label\cell\intbl Next value\cell\intbl\cell\row
\pard
}`;

    describe("rtf", function() {
        getTestFiles("rtf").forEach(function (testFile) {
            describe(testFile.name, function () {
                this.timeout(0);

                var result;

                before(function (done) {
                    utils.runRtfjs(testFile.dir, testFile.source, function (meta, html, twiz) {
                        result = {
                            html: html,
                            metadata: JSON.parse(meta)
                        };
                        $_$twiz = twiz;
                        done();
                    }, function (error) {
                        var formattedError = new Error(error.message);
                        formattedError.stack = error.stack;
                        return done(formattedError);
                    });
                });

                it("should return a result", function () {
                    expect(result).to.include.keys("html", "metadata");
                });

                it("should expected html equal result html", function () {
                    expect(testFile.expectedHtml).html.to.equal(result.html);
                });

                it("should expected metadata equal result metadata", function () {
                    expect(testFile.expectedMetadata).to.deep.equal(result.metadata);
                });
            });
        });
    });

    describe("rtf table regression", function() {
        this.timeout(0);
        var result;

        before(function(done) {
            utils.runRtfjs(__dirname, tableRegressionRtf, function(meta, html, twiz) {
                result = {
                    html: html,
                    metadata: JSON.parse(meta)
                };
                $_$twiz = twiz;
                done();
            }, function(error) {
                var formattedError = new Error(error.message);
                formattedError.stack = error.stack;
                done(formattedError);
            });
        });

        it("should preserve empty spacer cells for alignment", function() {
            expect(result.html).to.contain("<td></td>");
        });

        it("should emit visible border styles", function() {
            expect(result.html).to.contain("border-top: 2px solid rgb(0,0,0)");
            expect(result.html).to.contain("border-right: 2px solid rgb(0,0,0)");
        });

        it("should emit rowspans for vertical merges", function() {
            expect(result.html).to.contain('rowspan="2"');
            expect(result.html).to.contain("rowspan start");
        });
    });

    describe("emf", function() {
        getTestFiles("emf").forEach(function (testFile) {
            describe(testFile.name, function () {
                this.timeout(0);

                var result;

                before(function (done) {
                    utils.runEmfjs(testFile.source, function (svg, twiz) {
                        result = {
                            svg: svg
                        };
                        $_$twiz = twiz;
                        done();
                    }, function (error) {
                        var formattedError = new Error(error.message);
                        formattedError.stack = error.stack;
                        return done(formattedError);
                    });
                });

                it("should return a result", function () {
                    expect(result).to.include.keys("svg");
                });

                it("should expected svg equal result svg", function () {
                    expect(testFile.expectedSvg).html.to.equal(result.svg);
                });
            });
        });
    });

    describe("wmf", function() {
        getTestFiles("wmf").forEach(function (testFile) {
            describe(testFile.name, function () {
                this.timeout(0);

                var result;

                before(function (done) {
                    utils.runWmfjs(testFile.source, function (svg, twiz) {
                        result = {
                            svg: svg
                        };
                        $_$twiz = twiz;
                        done();
                    }, function (error) {
                        var formattedError = new Error(error.message);
                        formattedError.stack = error.stack;
                        return done(formattedError);
                    });
                });

                it("should return a result", function () {
                    expect(result).to.include.keys("svg");
                });

                it("should expected svg equal result svg", function () {
                    expect(testFile.expectedSvg).html.to.equal(result.svg);
                });
            });
        });
    });

    after(function() {
        // Apply captured types
        typewiz.applyTypes($_$twiz.get());
    });
});
