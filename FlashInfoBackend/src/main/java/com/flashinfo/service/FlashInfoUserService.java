package com.flashinfo.service;

import com.flashinfo.dto.FlashInfoUserRequestModel;
import com.flashinfo.user.entity.FlashUser;

public interface FlashInfoUserService {
    public FlashUser addFlashInfoUser(FlashInfoUserRequestModel userRequestModel);
}
