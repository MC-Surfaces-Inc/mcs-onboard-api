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
  let sql = "select preferredColors, preferredStyle, overlay, preferredCrown, bidType, upperCabinetSpecs, vanityHeightSpecs, softCloseStandard, areasOptionedOut, notes from program_details_cabinets join programs on program_details_cabinets.clientId=programs.clientId where program_details_cabinets.clientId=? and programs.cabinets=1;";
  let sql2 = "select preferredPadding, takeoffResponsibility, wasteFactor, notes from program_details_carpet join programs on program_details_carpet.clientId=programs.clientId where program_details_carpet.clientId=? and programs.carpet=1;";
  let sql3 = "select preferredMaterialThickness, preferredEdge, waterfallEdgeStandard, faucetHoles, stoveRangeSpecifications, takeoffResponsibility, wasteFactor, notes from program_details_countertops join programs on program_details_countertops.clientId=programs.clientId where program_details_countertops.clientId=? and programs.countertops=1;";
  let sql4 = "select floorSettingMaterial, customFloorSettingMaterial, wallSettingMaterial, customWallSettingMaterial, alottedFloat, chargeForExtraFloat, waterproofMethod, waterproofMethodShowerFloor, waterproofMethodShowerWalls, waterproofMethodTubWall, fiberglassResponsibility, backerboardInstallResponsibility, punchOutMaterial, showerNicheConstruction, showerNicheFraming, showerNicheBrand, cornerSoapDishesStandard, cornerSoapDishMaterial, showerSeatConstruction, metalEdgeOptions, groutJointSizing, groutJointNotes, preferredGroutBrand, upgradedGrout, groutProduct, subfloorStandardPractice, subfloorProducts, standardWallTileHeight, takeoffResponsibility, wasteFactor, wasteFactorWalls, wasteFactorFloors, wasteFactorMosaics, notes from program_details_tile join programs on program_details_tile.clientId=programs.clientId where program_details_tile.clientId=? and programs.tile=1;";
  let sql5 = "select preferredGlueProducts, otherGlueProducts, stainedOrPrimed, transitionStripsStandard, hvacRequirement, MCInstalledTrim, secondFloorConstruction, takeoffResponsibility, wasteFactor, notes from program_details_wood_vinyl join programs on program_details_wood_vinyl.clientId=programs.clientId where program_details_wood_vinyl.clientId=? and (programs.wood=1 or programs.vinyl=1);";
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
