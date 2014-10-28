var testf = function () {
var $val_1, $val_2, $val_3, $val_4, $val_5, $val_6, $val_7, $val_8, $val_9, $val_10, $val_11, $val_12, $val_13, $val_14, $val_15, $val_16, $val_17, $val_18, $val_19, $val_20, $val_21, $val_22, $val_23, $val_24, $val_25, $val_26, $val_27, $val_28, $val_29, $val_30, $val_31, $val_32, $val_33, $val_34, $val_35, $val_36, $val_37, $val_38, $val_39, $val_40, $val_41, $lev_1, $lev_2, $lev_3, $lev_4, $lev_5, $lev_6, $lev_7, $lev_8, $lev_9, $lev_10, $lev_11, $lev_12, $lev_13, $lev_14, $lev_15, $lev_16, $lev_17, $lev_18, $lev_19, $lev_20, $lev_21, $lev_22, $lev_23, $lev_24, $lev_25, $lev_26, $lev_27, $lev_28, $lev_29, $lev_30, $lev_31, $lev_32, $lev_33, $lev_34, $pc_holder_1, $lev_35, $lev_36, $lev_37, $lev_38, $lev_39, $lev_40, $lev_41, $pc, $lev_ctxt, $ret;
var div1, div2, div3, divs, h, l, $shadow_div1, $shadow_div2, $shadow_div3, $shadow_divs, $shadow_h, $shadow_l;
$pc = $runtime.lat.bot;
$shadow_div1 = $pc;
$shadow_div2 = $pc;
$shadow_div3 = $pc;
$shadow_divs = $pc;
$shadow_h = $pc;
$shadow_l = $pc;
$runtime.createShadowWindowProperties();
$lev_1 = $pc;
$val_1 = 1;
$check($runtime.lat.leq($pc, $shadow_h));
$shadow_h = $lev_1;
h = 1;
$check($runtime.lat.leq($pc, $shadow_h));
$shadow_h = $runtime.lat.lub($pc, '2');
$lev_2 = $runtime.lat.lub($pc, $shadow_document);
$val_2 = document;
$lev_3 = $pc;
$val_3 = 'createElement';
$lev_4 = $pc;
$val_4 = 'DIV';
$iflow_sig = $register($val_2, 'createElement');
if ($iflow_sig) {
	$iflow_sig.check($lev_2, $lev_3, $lev_4, $val_2, 'createElement', 'DIV');
	$val_5 = $val_2['createElement']('DIV');
	$lev_5 = $iflow_sig.label($val_5, $lev_2, $lev_3, $lev_4, $val_2, 'createElement', 'DIV');
} else {
	$check($legal('createElement'));
	$lev_ctxt = $runtime.lat.lub($lev_2, $lev_3, $inspect($val_2, 'createElement'));
	$ret = $val_2['createElement']($pc, 'DIV', $lev_4);
	$lev_5 = $ret.prop_lev;
	$val_5 = $ret.prop_val;
}
$check($runtime.lat.leq($pc, $shadow_div1));
$shadow_div1 = $lev_5;
div1 = $val_5;
$lev_6 = $runtime.lat.lub($pc, $shadow_document);
$val_6 = document;
$lev_7 = $pc;
$val_7 = 'createElement';
$lev_8 = $pc;
$val_8 = 'DIV';
$iflow_sig = $register($val_6, 'createElement');
if ($iflow_sig) {
	$iflow_sig.check($lev_6, $lev_7, $lev_8, $val_6, 'createElement', 'DIV');
	$val_9 = $val_6['createElement']('DIV');
	$lev_9 = $iflow_sig.label($val_9, $lev_6, $lev_7, $lev_8, $val_6, 'createElement', 'DIV');
} else {
	$check($legal('createElement'));
	$lev_ctxt = $runtime.lat.lub($lev_6, $lev_7, $inspect($val_6, 'createElement'));
	$ret = $val_6['createElement']($pc, 'DIV', $lev_8);
	$lev_9 = $ret.prop_lev;
	$val_9 = $ret.prop_val;
}
$check($runtime.lat.leq($pc, $shadow_div2));
$shadow_div2 = $lev_9;
div2 = $val_9;
$lev_10 = $runtime.lat.lub($pc, $shadow_document);
$val_10 = document;
$lev_11 = $pc;
$val_11 = 'createElement';
$lev_12 = $pc;
$val_12 = 'DIV';
$iflow_sig = $register($val_10, 'createElement');
if ($iflow_sig) {
	$iflow_sig.check($lev_10, $lev_11, $lev_12, $val_10, 'createElement', 'DIV');
	$val_13 = $val_10['createElement']('DIV');
	$lev_13 = $iflow_sig.label($val_13, $lev_10, $lev_11, $lev_12, $val_10, 'createElement', 'DIV');
} else {
	$check($legal('createElement'));
	$lev_ctxt = $runtime.lat.lub($lev_10, $lev_11, $inspect($val_10, 'createElement'));
	$ret = $val_10['createElement']($pc, 'DIV', $lev_12);
	$lev_13 = $ret.prop_lev;
	$val_13 = $ret.prop_val;
}
$check($runtime.lat.leq($pc, $shadow_div3));
$shadow_div3 = $lev_13;
div3 = $val_13;
$lev_14 = $runtime.lat.lub($pc, $shadow_div2);
$val_14 = div2;
$lev_15 = $pc;
$val_15 = 'appendChild';
$lev_16 = $runtime.lat.lub($pc, $shadow_div3);
$val_16 = div3;
$iflow_sig = $register($val_14, 'appendChild');
if ($iflow_sig) {
	$iflow_sig.check($lev_14, $lev_15, $lev_16, $val_14, 'appendChild', $val_16);
	$val_17 = $val_14['appendChild']($val_16);
	$lev_17 = $iflow_sig.label($val_17, $lev_14, $lev_15, $lev_16, $val_14, 'appendChild', $val_16);
} else {
	$check($legal('appendChild'));
	$lev_ctxt = $runtime.lat.lub($lev_14, $lev_15, $inspect($val_14, 'appendChild'));
	$ret = $val_14['appendChild']($pc, $val_16, $lev_16);
	$lev_17 = $ret.prop_lev;
	$val_17 = $ret.prop_val;
}
$lev_18 = $runtime.lat.lub($pc, $shadow_document);
$val_18 = document;
$lev_19 = $pc;
$val_19 = 'body';
$iflow_sig = $register($val_18, 'body');
if ($iflow_sig) {
	$iflow_sig.check($lev_18, $lev_19, $val_18, 'body');
	$val_20 = $val_18['body'];
	$lev_20 = $iflow_sig.label($val_20, $lev_18, $lev_19, $val_18, 'body');
} else {
	$lev_20 = $runtime.lat.lub($lev_18, $lev_19, $inspect($val_18, 'body'));
	if ('body' in $val_18) {
		$lev_20 = $runtime.lat.lub($lev_20, $val_18[$shadowV('body')]);
	}
	$check($legal('body'));
	$val_20 = $val_18['body'];
}
$lev_21 = $pc;
$val_21 = 'appendChild';
$lev_22 = $runtime.lat.lub($pc, $shadow_div1);
$val_22 = div1;
$iflow_sig = $register($val_20, 'appendChild');
if ($iflow_sig) {
	$iflow_sig.check($lev_20, $lev_21, $lev_22, $val_20, 'appendChild', $val_22);
	$val_23 = $val_20['appendChild']($val_22);
	$lev_23 = $iflow_sig.label($val_23, $lev_20, $lev_21, $lev_22, $val_20, 'appendChild', $val_22);
} else {
	$check($legal('appendChild'));
	$lev_ctxt = $runtime.lat.lub($lev_20, $lev_21, $inspect($val_20, 'appendChild'));
	$ret = $val_20['appendChild']($pc, $val_22, $lev_22);
	$lev_23 = $ret.prop_lev;
	$val_23 = $ret.prop_val;
}
$lev_24 = $runtime.lat.lub($pc, $shadow_document);
$val_24 = document;
$lev_25 = $pc;
$val_25 = 'body';
$iflow_sig = $register($val_24, 'body');
if ($iflow_sig) {
	$iflow_sig.check($lev_24, $lev_25, $val_24, 'body');
	$val_26 = $val_24['body'];
	$lev_26 = $iflow_sig.label($val_26, $lev_24, $lev_25, $val_24, 'body');
} else {
	$lev_26 = $runtime.lat.lub($lev_24, $lev_25, $inspect($val_24, 'body'));
	if ('body' in $val_24) {
		$lev_26 = $runtime.lat.lub($lev_26, $val_24[$shadowV('body')]);
	}
	$check($legal('body'));
	$val_26 = $val_24['body'];
}
$lev_27 = $pc;
$val_27 = 'appendChild';
$lev_28 = $runtime.lat.lub($pc, $shadow_div2);
$val_28 = div2;
$iflow_sig = $register($val_26, 'appendChild');
if ($iflow_sig) {
	$iflow_sig.check($lev_26, $lev_27, $lev_28, $val_26, 'appendChild', $val_28);
	$val_29 = $val_26['appendChild']($val_28);
	$lev_29 = $iflow_sig.label($val_29, $lev_26, $lev_27, $lev_28, $val_26, 'appendChild', $val_28);
} else {
	$check($legal('appendChild'));
	$lev_ctxt = $runtime.lat.lub($lev_26, $lev_27, $inspect($val_26, 'appendChild'));
	$ret = $val_26['appendChild']($pc, $val_28, $lev_28);
	$lev_29 = $ret.prop_lev;
	$val_29 = $ret.prop_val;
}
$lev_30 = $runtime.lat.lub($pc, $shadow_document);
$val_30 = document;
$lev_31 = $pc;
$val_31 = 'getElementsByTagName';
$lev_32 = $pc;
$val_32 = 'DIV';
$iflow_sig = $register($val_30, 'getElementsByTagName');
if ($iflow_sig) {
	$iflow_sig.check($lev_30, $lev_31, $lev_32, $val_30, 'getElementsByTagName', 'DIV');
	$val_33 = $val_30['getElementsByTagName']('DIV');
	$lev_33 = $iflow_sig.label($val_33, $lev_30, $lev_31, $lev_32, $val_30, 'getElementsByTagName', 'DIV');
} else {
	$check($legal('getElementsByTagName'));
	$lev_ctxt = $runtime.lat.lub($lev_30, $lev_31, $inspect($val_30, 'getElementsByTagName'));
	$ret = $val_30['getElementsByTagName']($pc, 'DIV', $lev_32);
	$lev_33 = $ret.prop_lev;
	$val_33 = $ret.prop_val;
}
$check($runtime.lat.leq($pc, $shadow_divs));
$shadow_divs = $lev_33;
divs = $val_33;
$lev_34 = $runtime.lat.lub($pc, $shadow_h);
$val_34 = h;
$pc_holder_1 = $pc;
$pc = $runtime.lat.lub($pc, $lev_34);
if ($val_34) {
	$lev_35 = $runtime.lat.lub($pc, $shadow_div2);
	$val_35 = div2;
	$lev_36 = $pc;
	$val_36 = 'appendChild';
	$lev_37 = $runtime.lat.lub($pc, $shadow_div1);
	$val_37 = div1;
	$iflow_sig = $register($val_35, 'appendChild');
	if ($iflow_sig) {
		$iflow_sig.check($lev_35, $lev_36, $lev_37, $val_35, 'appendChild', $val_37);
		$val_38 = $val_35['appendChild']($val_37);
		$lev_38 = $iflow_sig.label($val_38, $lev_35, $lev_36, $lev_37, $val_35, 'appendChild', $val_37);
	} else {
		$check($legal('appendChild'));
		$lev_ctxt = $runtime.lat.lub($lev_35, $lev_36, $inspect($val_35, 'appendChild'));
		$ret = $val_35['appendChild']($pc, $val_37, $lev_37);
		$lev_38 = $ret.prop_lev;
		$val_38 = $ret.prop_val;
	}
} else {
}
$pc = $pc_holder_1;
$lev_39 = $runtime.lat.lub($pc, $shadow_divs);
$val_39 = divs;
$lev_40 = $pc;
$val_40 = 0;
$iflow_sig = $register($val_39, 0);
if ($iflow_sig) {
	$iflow_sig.check($lev_39, $lev_40, $val_39, 0);
	$val_41 = $val_39[0];
	$lev_41 = $iflow_sig.label($val_41, $lev_39, $lev_40, $val_39, 0);
} else {
	$lev_41 = $runtime.lat.lub($lev_39, $lev_40, $inspect($val_39, 0));
	if (0 in $val_39) {
		$lev_41 = $runtime.lat.lub($lev_41, $val_39[$shadowV(0)]);
	}
	$check($legal(0));
	$val_41 = $val_39[0];
}
$check($runtime.lat.leq($pc, $shadow_l));
$shadow_l = $lev_41;
l = $val_41;
};
