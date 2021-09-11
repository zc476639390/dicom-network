package cn.sinso.DICOMNetwork.controller;


import cn.sinso.DICOMNetwork.dto.ResultDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/windowSet/")
public class WindowSetController {

    @GetMapping("/getByClassify")
    public ResultDTO getByClassify() {
        List list = new ArrayList<>();
        return ResultDTO.ok(list);
    }
}
