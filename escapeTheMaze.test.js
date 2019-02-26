let basicMazes = [];
let yourMazes = []; // Add your own tests in there!

function testMazes(mazes, expectedAnswer = undefined) {
  let pathTester = new PathTester();
  mazes.forEach(function(maze) {
    let your_answer = escape(maze);
    if (expectedAnswer) Test.assertSimilar(your_answer, expectedAnswer);
    else
      Test.expect(
        pathTester.testPath(your_answer, maze),
        pathTester.errorMessage
      );
  });
}

basicMazes.push(["# #", " > ", "# #"]);
basicMazes.push(["##########", "#>       #", "######## #"]);
basicMazes.push(["# ########", "#       >#", "##########"]);
basicMazes.push(["####### #", "#>#   # #", "#   #   #", "#########"]);
basicMazes.push([
  "#########",
  "#       #",
  "# ##### #",
  "# #   # #",
  "# #^# # #",
  "# ### # #",
  "#     # #",
  "####### #"
]);
basicMazes.push([
  "#########################################",
  "#<    #       #     #         # #   #   #",
  "##### # ##### # ### # # ##### # # # ### #",
  "# #   #   #   #   #   # #     #   #   # #",
  "# # # ### # ########### # ####### # # # #",
  "#   #   # # #       #   # #   #   # #   #",
  "####### # # # ##### # ### # # # #########",
  "#   #     # #     # #   #   # # #       #",
  "# # ####### ### ### ##### ### # ####### #",
  "# #             #   #     #   #   #   # #",
  "# ############### ### ##### ##### # # # #",
  "#               #     #   #   #   # #   #",
  "##### ####### # ######### # # # ### #####",
  "#   # #   #   # #         # # # #       #",
  "# # # # # # ### # # ####### # # ### ### #",
  "# # #   # # #     #   #     # #     #   #",
  "# # ##### # # ####### # ##### ####### # #",
  "# #     # # # #   # # #     # #       # #",
  "# ##### ### # ### # # ##### # # ### ### #",
  "#     #     #     #   #     #   #   #    ",
  "#########################################"
]);

Test.describe("Fixed tests", function() {
  Test.it("Basic tests", function() {
    testMazes(basicMazes);
  });
});
Test.describe("Your personal tests", function() {
  testMazes(yourMazes);
});
