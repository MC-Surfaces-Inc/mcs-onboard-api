const express = require("express");
const router = express.Router({ mergeParams: true });

const db = require("../../db");

router.get("/selections/:id", (req, res) => {
  let sql = "select cabinets, carpet, countertops, tile, vinyl, wood from programs where clientId=?;";

  db(req.baseUrl).query(sql, [ req.params.id ], (err, data) => {
    if (err) throw err;

    res.json({ selections: data[0] });
  });
});

router.get("/:id", (req, res) => {
  let sql = "select substitutionsAllowed, preferredColors, preferredStyle, overlay, preferredCrown, bidType, upperCabinetSpecs, vanityHeightSpecs, softCloseStandard, areasOptionedOut, notes from cabinet_program_details join programs on cabinet_program_details.clientId=programs.clientId where cabinet_program_details.clientId=? and programs.cabinets=1;";
  let sql2 = "select substitutionsAllowed, preferredPadding, takeoffResponsibility, wasteFactor, notes from carpet_program_details join programs on carpet_program_details.clientId=programs.clientId where carpet_program_details.clientId=? and programs.carpet=1;";
  let sql3 = "select substitutionsAllowed, preferredMaterialThickness, preferredEdge, waterfallEdgeStandard, faucetHoles, stoveRangeSpecifications, takeoffResponsibility, wasteFactor, notes from countertop_program_details join programs on countertop_program_details.clientId=programs.clientId where countertop_program_details.clientId=? and programs.countertops=1;";
  let sql4 = "select substitutionsAllowed, floorSettingMaterial, customFloorSettingMaterial, wallSettingMaterial, customWallSettingMaterial, allottedFloat, chargeForExtraFloat, waterproofMethod, waterproofMethodShowerFloor, waterproofMethodShowerWalls, waterproofMethodTubWall, fiberglassResponsibility, backerboardInstallResponsibility, punchOutMaterial, showerNicheConstruction, showerNicheFraming, showerNicheBrand, cornerSoapDishesStandard, cornerSoapDishMaterial, showerSeatConstruction, metalEdgeOptions, groutJointSizing, groutJointNotes, preferredGroutBrand, upgradedGrout, groutProduct, subfloorStandardPractice, subfloorProducts, standardWallTileHeight, takeoffResponsibility, wasteFactor, wasteFactorWalls, wasteFactorFloors, wasteFactorMosaics, notes from tile_program_details join programs on tile_program_details.clientId=programs.clientId where tile_program_details.clientId=? and programs.tile=1;";
  let sql5 = "select substitutionsAllowed, preferredGlueProducts, otherGlueProducts, stainedOrPrimed, transitionStripsStandard, hvacRequirement, MCInstalledTrim, secondFloorConstruction, takeoffResponsibility, wasteFactor, notes from wood_vinyl_program_details join programs on wood_vinyl_program_details.clientId=programs.clientId where wood_vinyl_program_details.clientId=? and (programs.wood=1 or programs.vinyl=1);";
  let params = Array(5).fill(req.params.id);

  db(req.baseUrl).query(sql.concat(sql2, sql3, sql4, sql5), params, (err, data) => {
    if (err) throw err;

    res.json({
      programs: {
        cabinets: data[0][0],
        carpet: data[1][0],
        countertops: data[2][0],
        tile: data[3][0],
        woodVinyl: data[4][0],
      }
    });
  });
});

module.exports = router;
